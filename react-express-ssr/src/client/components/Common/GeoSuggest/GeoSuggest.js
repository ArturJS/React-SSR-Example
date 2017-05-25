import React, {Component} from 'react';
import {LocalizationField} from './../../Common/Localization';
import PropTypes from 'prop-types';
import './GeoSuggest.scss';

export default class GeoSuggest extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		dictionaryName: PropTypes.string.isRequired,
		fromPlaceholder: PropTypes.bool.isRequired,
		country: PropTypes.string
	};

	static contextTypes = {
		store: PropTypes.object.isRequired
	};

	state = {
		isUnavailable: false
	};

	componentDidMount() {
		if (window.google) {
			this.initGeoSuggest();
		}
		else {
			window.onload = () => {
				this.initGeoSuggest();
			};
		}
	}


	getCtrl() {
		return this.context.store.ctrls[this.props.name];
	}

	initGeoSuggest = () => {
		if (!window.google) {
			this.setState({isUnavailable: true});
			return;
		}

		this.ctrl = this.getCtrl();

		this.autocomplete = new window.google.maps.places.Autocomplete(this.getCtrl().ref,
			{
				types: ['establishment'],
				componentRestrictions: {country: this.props.country}
			}
		);

		this.autocomplete.addListener('place_changed', (() => {
			this.ctrl.options.viewValue = this.ctrl.ref.value;
			this.onChange(this.autocomplete.getPlace());
			// eslint-disable-next-line no-extra-bind
		}).bind(this));

		this.service = new window.google.maps.places.AutocompleteService();
	};

	checkServiceStatus = (searchValue) => {
		if (!this.service) return;

		try {
			this.service.getQueryPredictions({input: searchValue}, (predictions, status) => {
				if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
					this.setState({isUnavailable: true});
					return;
				}
				this.setState({isUnavailable: false});
			});
		}
		catch (err) {
			// eslint-disable-line no-empty
		}
	};

	inputGeoSuggestCtrl = ({name, value, placeholder, onFocus, error, onChange, onBlur, disabled, tabIndex, ctrl}) => {
		const changeSuggestion = (e) => {
			let inputValue = e.target.value;
			ctrl.options.viewValue = inputValue;
			this.checkServiceStatus(inputValue);
		};

		const {isUnavailable} = this.state;

		this.onChange = onChange;

		return (
			<div className="geosuggest-container">
				<input
					tabIndex={tabIndex}
					type="text"
					id={name}
					name={name}
					value={ctrl.options.viewValue}
					placeholder={placeholder}
					disabled={disabled}
					className="form-control"
					onChange={changeSuggestion}
					onBlur={onBlur}
					ref={(input) => {
						ctrl.ref = input;
					}}
					onFocus={onFocus}/>
				{isUnavailable &&
				'Sorry, search service is unavailable. Please type in your address manually.'
				}
			</div>
		);
	};


	render() {
		return (<LocalizationField
			className="control-field geosuggest-field"
			name={this.props.name}
			control={this.inputGeoSuggestCtrl}
			dictionaryName={this.props.dictionaryName}
			fromPlaceholder={this.props.fromPlaceholder}/>);
	}
}
