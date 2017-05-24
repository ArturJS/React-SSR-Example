import React, {Component} from 'react';
import {Controls} from '../../../../Common/Form/index';
import {LocalizationField, LocalizationLabel} from '../../../../Common/Localization/index';
import classNames from 'classnames';

export default class Ownership extends Component {
	render() {
		const {
			inputTextCtrl,
			prefixPhoneInputCtrl,
			inputSelectWithEmptyOptionCtrl,
			prefixInputCtrl
		} = Controls;

		return (<div className="person-info-group">
			<div
				className={classNames('form-block', 'person-info-block')}>
				<div className="form-group ">
					<LocalizationLabel
						htmlFor="firstName"
						className="control-label"
						dictionaryName="firstName"/>
					<LocalizationField
						className="control-field"
						name="firstName"
						control={inputTextCtrl}
						dictionaryName="firstName"
						fromPlaceholder={true}/>
				</div>

				<div className="form-group">
					<LocalizationLabel
						htmlFor="lastName"
						className="control-label"
						dictionaryName="lastName"/>
					<LocalizationField
						className="control-field"
						name="lastName"
						control={inputTextCtrl}
						dictionaryName="lastName"
						fromPlaceholder={true}/>
				</div>

				<div className="form-group">
					<LocalizationLabel
						htmlFor="nationality"
						className="control-label"
						dictionaryName="nationality"/>
					<LocalizationField
						className="control-field"
						name="nationality"
						control={inputSelectWithEmptyOptionCtrl}
						dictionaryName="nationality"
						fromPlaceholder={true}/>
				</div>

				<div className="form-group">
					<LocalizationLabel
						htmlFor="emiratesId"
						className="control-label"
						dictionaryName="emiratesId"/>
					<LocalizationField
						className="control-field"
						name="emiratesId"
						control={prefixInputCtrl}
						dictionaryName="emiratesId"
						fromPlaceholder={true}/>
				</div>

				<div className="form-group">
					<LocalizationLabel
						htmlFor="mobileNumber"
						className="control-label"
						dictionaryName="mobileNumber"/>
					<LocalizationField
						className="control-field"
						name="mobileNumber"
						control={prefixPhoneInputCtrl}
						dictionaryName="mobileNumber"
						fromPlaceholder={true}/>
				</div>
			</div>
		</div>);
	}
}
