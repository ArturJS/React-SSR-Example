import React, {Component} from 'react';
import GeoSuggest from './../../../../Common/GeoSuggest';
import {Controls} from '../../../../Common/Form/index';
import {LocalizationField, LocalizationLabel} from '../../../../Common/Localization/index';

export default class BusinessDetails extends Component {
	render() {
		const {
			inputTextCtrl,
			prefixPhoneInputCtrl,
			inputSelectWithEmptyOptionCtrl,
			inputCheckboxWithLabelCtrl,
			inputSelectCategoryCtrl,
			inputSelectDescriptionCtrl
		} = Controls;

		return (<div className="person-info-group">
			<div className="form-block business-details-block">
				<div className="form-group geo-suggest-group">
					<LocalizationLabel
						htmlFor="places"
						className="control-label"
						dictionaryName="places"/>
					<div className="control-field">
						<GeoSuggest
							country="AE"
							dictionaryName="places"
							name="places"
							fromPlaceholder={true}/>
					</div>
				</div>
				<div className="form-group street-name-group">
					<LocalizationLabel
						htmlFor="streetName"
						className="control-label"
						dictionaryName="streetName"/>
					<LocalizationField
						className="control-field"
						name="streetName"
						control={inputTextCtrl}
						dictionaryName="streetName"
						fromPlaceholder={true}/>
				</div>
				<div className="form-group post-office-box-group">
					<LocalizationLabel
						htmlFor="postOfficeBox"
						className="control-label"
						dictionaryName="postOfficeBox"/>
					<LocalizationField
						className="control-field"
						name="postOfficeBox"
						control={inputTextCtrl}
						dictionaryName="postOfficeBox"
						fromPlaceholder={true}/>
				</div>
				<div className="form-group city-group">
					<LocalizationLabel
						htmlFor="city"
						className="control-label"
						dictionaryName="city"/>
					<LocalizationField
						className="control-field city-field"
						name="city"
						control={inputSelectWithEmptyOptionCtrl}
						dictionaryName="city"
						fromPlaceholder={true}/>
				</div>
				<div className="form-group country-group">
					<LocalizationLabel
						htmlFor="country"
						className="control-label"
						dictionaryName="country"/>
					<LocalizationField
						className="control-field"
						name="country"
						control={inputTextCtrl}
						dictionaryName="country"
						fromPlaceholder={true}/>
				</div>
				<div className="form-group">
					<LocalizationLabel
						htmlFor="companyPhone"
						className="control-label"
						dictionaryName="companyPhone"/>
					<LocalizationField
						className="control-field regular-phone-field"
						name="companyPhone"
						control={prefixPhoneInputCtrl}
						dictionaryName="companyPhone"
						fromPlaceholder={true}/>
				</div>
				<div className="form-group">
					<LocalizationLabel
						htmlFor="website"
						className="control-label"
						dictionaryName="website"/>
					<LocalizationField
						className="control-field"
						name="website"
						control={inputTextCtrl}
						dictionaryName="website"
						fromPlaceholder={true}/>
				</div>

				<div className="form-group">
					<LocalizationLabel
						htmlFor="legalName"
						className="control-label"
						dictionaryName="legalName"/>
					<LocalizationField
						className="control-field"
						name="legalName"
						control={inputTextCtrl}
						dictionaryName="legalName"
						fromPlaceholder={true}/>
				</div>
				<div className="form-group">
					<LocalizationLabel
						htmlFor="entityType"
						className="control-label"
						dictionaryName="entityType"/>
					<LocalizationField
						className="control-field"
						name="entityType"
						control={inputSelectWithEmptyOptionCtrl}
						dictionaryName="entityType"
						fromPlaceholder={true}/>
				</div>

				<div className="form-group">
					<LocalizationLabel
						htmlFor="merchantName"
						className="control-label"
						dictionaryName="merchantName"/>
					<LocalizationField
						className="control-field"
						name="merchantName"
						control={inputTextCtrl}
						dictionaryName="merchantName"
						fromPlaceholder={true}/>
				</div>
				<div className="form-group">
					<LocalizationField
						className="control-field merchant-name-checkbox-field"
						name="merchantNameCheckbox"
						control={inputCheckboxWithLabelCtrl}
						dictionaryName="merchantNameCheckbox"/>
				</div>
				<div className="form-group">
					<LocalizationLabel
						htmlFor="businessSize"
						className="control-label"
						dictionaryName="businessSize"/>
					<LocalizationField
						className="control-field"
						name="businessSize"
						control={inputSelectWithEmptyOptionCtrl}
						dictionaryName="businessSize"/>
				</div>
				<div className="form-group">
					<LocalizationLabel
						htmlFor="countEmployees"
						className="control-label"
						dictionaryName="countEmployees"/>
					<LocalizationField
						className="control-field short-control-field"
						name="countEmployees"
						control={inputSelectWithEmptyOptionCtrl}
						dictionaryName="countEmployees"/>
				</div>
				<div className="form-group">
					<LocalizationLabel
						htmlFor="businessTypeCategory"
						className="control-label"
						dictionaryName="businessTypeCategory"/>
					<LocalizationField
						className="control-field"
						name="businessTypeCategory"
						control={inputSelectCategoryCtrl}
						dictionaryName="businessTypeCategory"
						fromPlaceholder={true}/>
				</div>
				<div className="form-group">
					<LocalizationLabel
						htmlFor="countOutlets"
						className="control-label "
						dictionaryName="countOutlets"/>
					<LocalizationField
						className="control-field short-control-field"
						name="countOutlets"
						control={inputTextCtrl}
						dictionaryName="countOutlets"/>
				</div>
				<div className="form-group">
					<LocalizationLabel
						htmlFor="businessTypeDescription"
						className="control-label"
						dictionaryName="businessTypeDescription"/>
					<LocalizationField
						className="control-field"
						name="businessTypeDescription"
						control={inputSelectDescriptionCtrl}
						dictionaryName="businessTypeDescription"
						fromPlaceholder={true}/>
				</div>
			</div>
		</div>);
	}
}
