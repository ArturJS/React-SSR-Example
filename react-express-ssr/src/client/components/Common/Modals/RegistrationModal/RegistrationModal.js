import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import {Form, FormStore, Controls, Validators} from './../../Form';
import {LocalizationLabel, Localization, LocalizationField} from './../../Localization';
import Recaptcha from '../../Recaptcha/Recaptcha';
import {loginApi} from '../../../../api/loginApi';
import ErrorSummary from './../../ErrorSummary';
import './RegistrationModal.scss';

@inject('modalStore', 'localizationStore')
export default class RegistrationModal extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired
	};

	state = {
		errors: null
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('RegistrationModal');
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

	requestCaptchaVerified = () => {
		const {
			login,
			password
		} = this.formStore.getValues();

		loginApi.doSignUp(login, password)
			.then(() => {
				this.props.modalStore.close(true);
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

	onSubmit = (async (event) => {
		event && event.preventDefault();

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
				onSubmit={this.onSubmit}
				store={this.formStore}
				className="registration-modal clearfix">
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
