import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, FormStore, Controls, Validators} from './../../Form';
import {Field, Transformers} from './../../Form';
import {LocalizationLabel, Localization, LocalizationField} from './../../Localization';
import {AE_MOBILE_PHONE_PREFIX} from './../../../../constants/common';
import {inject} from 'mobx-react';
import _ from 'lodash';
import {dictionaryApi} from '../../../../api/dictionaryApi';
import './NewMerchantModal.scss';

@inject('localizationStore', 'modalStore')
export default class NewMerchantModal extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		application: PropTypes.object,
		isReadonly: PropTypes.bool,
		modalStore: PropTypes.object.isRequired
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('NewMerchantModal');

		const {
			application,
			isReadonly
		} = this.props;

		const {validators} = this.dictionary;

		let formStoreConfig = {
			merchantName: {
				value: '',
				validators: [
					Validators.required(validators.merchantName.required)
				]
			},
			merchantSales: {
				value: '',
				transform: Transformers.numberWithLength(9),
				onFocusTransform: Transformers.moneyFormats.dollar.onFocus,
				onBlurTransform: Transformers.moneyFormats.dollar.onBlur,
				validators: [
					Validators.required(validators.merchantSales.required)
				]
			},
			businessTypeCategory: {
				value: '',
				options: {
					data: {} // necessary for immediate attaching of Object like lists of options
				},
				validators: [
					Validators.required(validators.businessTypeCategory.required)
				],
				onChanged: (ctrl, ctrls) => {
					let {businessTypeSubCategory} = ctrls;

					businessTypeSubCategory.options.data = ctrl.options.data[ctrl.value];
					businessTypeSubCategory.value = '';
					businessTypeSubCategory.disabled = false;
				}
			},
			businessTypeSubCategory: {
				value: '',
				options: {
					data: {} // necessary for immediate attaching of Object like lists of options
				},
				disabled: true
			},
			emirate: {
				value: '',
				options: [],
				validators: [
					Validators.required(validators.emirate.required)
				]
			},
			fullAddress: {
				value: '',
				validators: [
					Validators.required(validators.fullAddress.required)
				]
			},
			contactFirstName: {
				value: '',
				validators: [
					Validators.required(validators.contactFirstName.required),
					Validators.regex(/^[a-zA-Z]+$/, validators.contactFirstName.regex)
				]
			},
			contactLastName: {
				value: '',
				validators: [
					Validators.required(validators.contactLastName.required),
					Validators.regex(/^[a-zA-Z]+$/, validators.contactLastName.regex)
				]
			},
			contactNumber: {
				value: '',
				options: {
					prefix: AE_MOBILE_PHONE_PREFIX
				},
				onFocusTransform: Transformers.phoneOnFocus,
				onBlurTransform: Transformers.mobilePhoneOnBlur,
				transform: Transformers.mobilePhone,
				validators: [
					Validators.required(validators.contactNumber.required),
					Validators.mobilePhoneValidator(validators.contactNumber.invalid)
				]
			},
			productReferred: {
				options: [{name: 'POS', value: 'POS'}],
				value: '',
				validators: [
					Validators.required(validators.productReferred.required)
				]
			},
			status: {
				value: ''
			}
		};

		if (application) {
			_.forOwn(formStoreConfig, (field, name) => {
				field.value = application[name];
				field.disabled = isReadonly;
			});
		}


		this.formStore = new FormStore(formStoreConfig);
	}

	async componentDidMount() {
		let [
			mccs,
			emirates
		] = await Promise.all([
			dictionaryApi.getMCCs(),
			dictionaryApi.getEmirates()
		]);
		const {ctrls} = this.formStore;

		ctrls.businessTypeCategory.options.data = mccs;
		ctrls.businessTypeSubCategory.options.data = ctrls.businessTypeCategory.options.data[ctrls.businessTypeCategory.value];
		ctrls.emirate.options.replace(emirates);
	}

	submit = (e) => {
		e.preventDefault();

		const {valid} = this.formStore.validate();

		if (!valid) return false;

		this.props.modalStore.close(
			this.formStore.getValues()
		);
	};

	render() {
		const {
			inputTextCtrl,
			inputSelectCategoryCtrl,
			inputSelectDescriptionCtrl,
			inputSelectWithEmptyOptionCtrl,
			prefixPhoneInputCtrl
		} = Controls;
		const {isReadonly} = this.props;
		const status = this.formStore.ctrls.status.value;

		return (
			<Localization
				className="form"
				localizationDictionary={this.dictionary}>
				<Form
					store={this.formStore}
					onSubmit={this.submit}
					className="new-merchant-modal clearfix">
					<div className="form">
						<div className="form-group">
							<LocalizationLabel
								htmlFor="merchantName"
								className="control-label"
								dictionaryName="merchantName"/>
							<LocalizationField
								className="control-field"
								name="merchantName"
								control={inputTextCtrl}
								dictionaryName="merchantName"/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="merchantSales"
								className="control-label"
								dictionaryName="merchantSales"/>
							<LocalizationField
								className="control-field"
								name="merchantSales"
								control={inputTextCtrl}
								dictionaryName="merchantSales"
								fromPlaceholder={true}/>
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
								dictionaryName="businessTypeCategory"/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="businessTypeSubCategory"
								className="control-label"
								dictionaryName="businessTypeSubCategory"/>
							<LocalizationField
								className="control-field"
								name="businessTypeSubCategory"
								control={inputSelectDescriptionCtrl}
								dictionaryName="businessTypeSubCategory"/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="emirate"
								className="control-label"
								dictionaryName="emirate"/>
							<LocalizationField
								className="control-field"
								name="emirate"
								control={inputSelectWithEmptyOptionCtrl}
								dictionaryName="emirate"/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="fullAddress"
								className="control-label"
								dictionaryName="fullAddress"/>
							<LocalizationField
								className="control-field"
								name="fullAddress"
								control={inputTextCtrl}
								dictionaryName="fullAddress"/>
						</div>
					</div>
					<div className="form">
						<div className="form-group">
							<LocalizationLabel
								htmlFor="contactFirstName"
								className="control-label"
								dictionaryName="contactFirstName"/>
							<LocalizationField
								className="control-field"
								name="contactFirstName"
								control={inputTextCtrl}
								dictionaryName="contactFirstName"/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="contactLastName"
								className="control-label"
								dictionaryName="contactLastName"/>
							<LocalizationField
								className="control-field"
								name="contactLastName"
								control={inputTextCtrl}
								dictionaryName="contactLastName"/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="contactNumber"
								className="control-label"
								dictionaryName="contactNumber"/>
							<LocalizationField
								className="control-field"
								name="contactNumber"
								control={prefixPhoneInputCtrl}
								fromPlaceholder={true}
								dictionaryName="contactNumber"/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								className="control-label"
								dictionaryName="productReferred"/>
							<Field
								className="control-field"
								name="productReferred"
								control={inputSelectWithEmptyOptionCtrl}/>
						</div>
						{status &&
						<div className="form-group status-group">
							<label className="control-label">Status:</label>
							<div className="control-field status-field">
								{status}
							</div>
						</div>
						}
					</div>
					{!isReadonly &&
					<button className="btn btn-primary pull-right">{this.dictionary.buttons.submit}</button>
					}
				</Form>
			</Localization>
		);
	}
}
