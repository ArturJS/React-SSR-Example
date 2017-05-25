import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
	AE_MOBILE_PHONE_PREFIX,
	fullNameRegex
} from './../../../constants/common';
import {observer, inject} from 'mobx-react';
import {Form, FormStore, Validators, Controls, Transformers} from '../../Common/Form';
import {LocalizationLabel, Localization, LocalizationField} from './../../Common/Localization';
import ErrorSummary from './../../Common/ErrorSummary';
import Recaptcha from './../../Common/Recaptcha';
import processErrors from './../../Common/ProcessErrors';
import restoreFormData from './../../Common/RestoreFormData';
import {ResendConfirmLinkModal} from './../../Common/Modals';
import {merchantCreateAccountApi} from '../../../api/merchantCreateAccountApi';
import './MerchantCreateAccountPage.scss';

const userId = 'merchant';
const STEP_NAME = 'create_account';

function isEmailAlreadyUsedError(error) { // todo change error processing on errorId check
	return _.get(error, 'response.data.errors', []).join('').toLowerCase().indexOf('email is already used') > -1;
}

@restoreFormData
@processErrors
@inject('localizationStore', 'modalStore')
@observer
export default class MerchantCreateAccountPage extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired,
		saveFormData: PropTypes.func.isRequired,
		getFormData: PropTypes.func.isRequired,
		removeFormData: PropTypes.func.isRequired,
		errors: PropTypes.array,
		setErrors: PropTypes.func.isRequired,
		processAjaxError: PropTypes.func.isRequired
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('MerchantCreateAccountPage');
		const {validators} = this.dictionary;

		this.formStore = new FormStore({
			email: {
				value: '',
				maxLength: 254,
				validators: [
					Validators.required(validators.email.required),
					Validators.regex(/^[^.](?!\.\.)(.(?!\.\.))*[^.]$/, validators.email.wrongDots),
					Validators.email(validators.email.regex),
					Validators.minLength(6, validators.email.minLength)
				],
				onBlured: this.saveToLocalStorage
			},
			company: {
				value: '',
				maxLength: 30,
				validators: [
					Validators.required(validators.company.required),
					Validators.name(validators.company.name)
				],
				onBlured: this.saveToLocalStorage
			},
			name: {
				value: '',
				maxLength: 254,
				validators: [ // Validators order is important!
					Validators.required(validators.name.required),
					Validators.regex(fullNameRegex, validators.name.regex),
					Validators.regex(/^\S+\s+\S+/, validators.name.required)
				],
				onBlured: this.saveToLocalStorage
			},
			phone: {
				value: '',
				maxLength: 8,
				options: {
					prefix: AE_MOBILE_PHONE_PREFIX
				},
				onFocusTransform: Transformers.phoneOnFocus,
				onBlurTransform: Transformers.mobilePhoneOnBlur,
				transform: Transformers.mobilePhone,
				validators: [
					Validators.required(validators.phone.required),
					Validators.mobilePhoneValidator(validators.phone.invalid)
				],
				onBlured: this.saveToLocalStorage
			}
		});
	}

	componentDidMount() {
		let storageData = this.props.getFormData(userId, STEP_NAME);

		if (!_.isEmpty(storageData)) {
			this.formStore.setFormData(storageData);
		}
		this.formStore.setFocusFirstEmpty();
	}


	requestCaptchaVerified = (async (captchaText) => {
		let formData = this.formStore.getValues();

		try {
			await merchantCreateAccountApi
				.postFormData({
					...formData,
					captchaText
				}, {showLoading: true}, AE_MOBILE_PHONE_PREFIX);

			this.props.history.push({
				pathname: '/form',
				query: this.props.location.query
			});

			this.props.removeFormData(userId, STEP_NAME);
		}
		catch (error) {
			this.processAjaxError(error);
		}
	});

	processAjaxError = (error) => {
		window.grecaptcha.reset(window.recapthcaId);

		if (isEmailAlreadyUsedError(error)) {
			this.props.modalStore
				.showCustom('Email already in use', <ResendConfirmLinkModal/>, 'resend-confirm-link-modal');
		}
		else {
			this.props.processAjaxError(error);
		}
	};

	saveToLocalStorage = () => {
		this.props.saveFormData(userId, STEP_NAME, this.formStore.getValues());
	};

	submit = (async (event) => {
		event && event.preventDefault();

		let result = this.formStore.validate();
		if (!result.valid) {
			console.log('Errors:', result.errors);
			return;
		}
		let callBack = window.grecaptcha.execute;

		if (!process.env.isCapthcaEnable) {
			callBack = this.requestCaptchaVerified;
		}
		else {
			callBack = window.grecaptcha.execute;
		}
		callBack(window.recapthcaId);
	});

	render() {
		const {
			inputTextCtrl,
			prefixPhoneInputCtrl
		} = Controls;
		const {
			title,
			subtitle,
			buttons,
			agreementsInfo
		} = this.dictionary;
		const {
			errors
		} = this.props;

		/* eslint-disable react/no-danger */

		return (
			<div className="create-account-page">
				<Localization
					className="content"
					localizationDictionary={this.dictionary}>
					<div>
						<h1 className="page-title">{title}</h1>
						<h3 className="page-subtitle">{subtitle}</h3>
					</div>
					<Form
						className="create-account-form"
						store={this.formStore}
						onSubmit={this.submit}>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="email"
								className="control-label"
								dictionaryName="email"/>
							<LocalizationField
								className="control-field"
								name="email"
								control={inputTextCtrl}
								dictionaryName="email"
								fromPlaceholder={true}/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="company"
								className="control-label"
								dictionaryName="company"/>
							<LocalizationField
								className="control-field"
								name="company"
								control={inputTextCtrl}
								dictionaryName="company"
								fromPlaceholder={true}/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="name"
								className="control-label"
								dictionaryName="name"/>
							<LocalizationField
								className="control-field"
								name="name"
								control={inputTextCtrl}
								dictionaryName="name"
								fromPlaceholder={true}/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="phone"
								className="control-label"
								dictionaryName="phone"/>
							<LocalizationField
								className="control-field"
								name="phone"
								control={prefixPhoneInputCtrl}
								dictionaryName="phone"
								fromPlaceholder={true}/>
						</div>
						<Recaptcha
							className="recaptcha"
							verifyCallback={this.requestCaptchaVerified}/>
						<ErrorSummary errors={errors}/>
						<button type="submit" className="btn btn-primary btn-continue">
							{buttons.continue}
						</button>
					</Form>
					<div className="agreements-info" dangerouslySetInnerHTML={{__html: agreementsInfo}}/>
				</Localization>
			</div>);

		/* eslint-enable react/no-danger */
	}
}
