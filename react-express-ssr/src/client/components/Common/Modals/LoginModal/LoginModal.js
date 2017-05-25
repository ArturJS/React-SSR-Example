import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Form, FormStore, Controls, Validators} from './../../Form';
import {LocalizationLabel, Localization, LocalizationField} from './../../Localization';
import Recaptcha from './../../../Common/Recaptcha/Recaptcha';
import {loginApi} from '../../../../api/loginApi';
import ErrorSummary from './../../ErrorSummary';
import RegistrationModal from './../RegistrationModal/RegistrationModal';
import {ROLES} from './../../../../enums/common.enums';
import './LoginModal.scss';


@withRouter
@inject('modalStore', 'localizationStore')
export default class LoginModal extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired
	};

	state = {
		errors: null
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('LoginModal');
		const {validators} = this.dictionary;

		this.formStore = new FormStore({
			login: {
				value: '',
				validators: [
					Validators.required(validators.login.required)
				]
			},
			password: {
				value: '',
				validators: [
					Validators.required(validators.password.required)
				]
			}
		});
	}

	showRegistrationModal = (e) => {
		e.preventDefault();
		this.props.modalStore.close();
		this.props.modalStore.showCustom(this.dictionary.registrationModalTitle, <RegistrationModal/>);
	};

	requestCaptchaVerified = (captchaText) => {
		const {
			login,
			password
		} = this.formStore.getValues();

		loginApi.doSignIn(login, password)
			.then(({role, applicationStatus}) => {
				this.props.modalStore.close(true);

				if (role === ROLES.merchantOnboarding) { // todo add check on applicationStatus when requirements is ready
					this.props.history.push('/form');
				}
				else if (role === ROLES.referral) {
					this.props.history.push('/my-referral-applications');
				}
			})
			.catch(error => {
				window.grecaptcha.reset(window.recapthcaId);

				if (error.response.status === 400) {
					this.setState({
						errors: error.response.data.errors
					});
				}
			});
	};

	loginSubmit = (async(event) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		let result = this.formStore.validate();
		if (!result.valid) {
			console.log('Errors:', result.errors);
			return;
		}

		let callBack;
		if (process && process.env.at) {
			callBack = this.requestCaptchaVerified;
		}
		else {
			callBack = window.grecaptcha.execute;
		}
		callBack(window.recapthcaId);
	});

	render() {
		const {inputTextCtrl, inputPasswordCtrl} = Controls;
		const {loginButton} = this.dictionary;
		const {errors} = this.state;

		return (
			<Form
				onSubmit={this.loginSubmit}
				store={this.formStore}
				className="login-modal clearfix">
				<Localization
					className="form"
					localizationDictionary={this.dictionary}>
					<div className="form">
						<div className="form-group">
							<LocalizationLabel
								htmlFor="login"
								className="control-label"
								dictionaryName="login"/>
							<LocalizationField
								className="control-field"
								name="login"
								control={inputTextCtrl}
								dictionaryName="login"/>
						</div>
						<div className="form-group">
							<LocalizationLabel
								htmlFor="password"
								className="control-label"
								dictionaryName="password"/>
							<LocalizationField
								className="control-field"
								name="password"
								control={inputPasswordCtrl}
								dictionaryName="password"/>
						</div>
						<ErrorSummary errors={errors}/>
						<a className="link form-link without-label">{this.dictionary.isPassword}</a>
					</div>
					<button className="btn btn-primary modal-button pull-right">{loginButton.label}</button>
					<Recaptcha
						className="recaptcha"
						verifyCallback={this.requestCaptchaVerified}/>
				</Localization>
			</Form>
		);
	}
}
