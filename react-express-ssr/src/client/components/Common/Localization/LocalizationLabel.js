import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class LocalizationLabel extends Component {
	static propTypes = {
		htmlFor: PropTypes.string,
		className: PropTypes.string,
		dictionaryName: PropTypes.string
	};


	static contextTypes = {
		localizationDictionary: PropTypes.object,
		store: PropTypes.object
	};

	isRequired = () => {
		let {dictionaryName} = this.props;
		let isHaveRequired = false;

		this.context.store
			.ctrls[dictionaryName]
			.validators.forEach(validator => {
				if (validator.isRequiredFunction) {
					isHaveRequired = true;
				}
			});

		return isHaveRequired;
	};


	render() {
		let {htmlFor, className, dictionaryName} = this.props;

		return (
			<label
				htmlFor={htmlFor}
				className={className}>
				{this.context.localizationDictionary[dictionaryName]}
				{this.isRequired() && ' * '}
			</label>
		);
	}
}
