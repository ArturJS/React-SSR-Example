import React, {Component} from 'react';
import {Field} from './../Form';
import PropTypes from 'prop-types';

export default class LocalizationField extends Component {
	static propTypes = {
		dictionaryName: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		control: PropTypes.func.isRequired,
		hideError: PropTypes.bool,
		hidePlaceholder: PropTypes.bool,
		className: PropTypes.string,
		fromPlaceholder: PropTypes.bool
	};
	static contextTypes = {
		localizationDictionary: PropTypes.object
	};

	render() {
		let {name, control, hideError, hidePlaceholder, className, dictionaryName, tabIndex, children} = this.props;
		let {localizationDictionary} = this.context;

		let text = localizationDictionary[dictionaryName];
		if (this.props.fromPlaceholder) {
			text = localizationDictionary.placeholders && localizationDictionary.placeholders[dictionaryName] ?
				localizationDictionary.placeholders[dictionaryName] : '';
		}

		return (
			<Field
				className={className}
				name={name}
				tabIndex={tabIndex}
				control={control}
				hideError={hideError}
				placeholder={hidePlaceholder ? '' : text}>
				{children}
			</Field>
		);
	}
}
