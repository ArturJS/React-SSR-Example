import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Form, FormStore, Controls, Validators} from './../../Form';
import {LocalizationLabel, Localization, LocalizationField} from './../../Localization';
import {ModalDictionary} from '../../../Common/ModalProvider';
import './UnfinishedAppModal.scss';

@withRouter
@inject('modalStore', 'localizationStore')
export default class UnfinishedAppModal extends Component {
	static propTypes = {
		hasPassword: PropTypes.bool.isRequired,
		onSendPassword: PropTypes.func.isRequired,
		localizationStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('UnfinishedAppModal');
		const {validators} = this.dictionary;

		this.formStore = new FormStore({
			email: {
				value: '',
				validators: [
					Validators.required(validators.email.required),
					// eslint-disable-next-line max-len
					Validators.regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, validators.email.regex)
					// regex has been taken from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript/31311899#answer-46181
				]
			}
		});
	}

	onLogIn = () => {
		this.props.modalStore.close();
		this.props.history.push(`/?${ModalDictionary.login.prop}`);
	};

	onSendPassword = (e) => {
		e.preventDefault();

		let result = this.formStore.validate();
		if (!result.valid) return;

		let {email} = this.formStore.getValues();

		this.props.onSendPassword(email);
		this.formStore.ctrls.email.value = '';
	};

	onSkipApp = () => {
		this.props.history.push('/form/package-type');
		this.props.modalStore.close();
	};

	render() {
		const {inputTextCtrl} = Controls;
		const {hasPassword} = this.props;
		const {
			loginText,
			sendEmailText,
			skipAppText,
			buttons
		} = this.dictionary;

		return (
			<div className="unfinished-app-modal">
				{hasPassword &&
				<p>
					{loginText}
					&nbsp;
					<button
						type="button"
						className="btn btn-link"
						onClick={this.onLogIn}>
						{buttons.login}
					</button>
				</p>
				}

				{!hasPassword &&
				<Form
					onSubmit={this.onSendPassword}
					store={this.formStore}
					className="send-password-form">
					<p>{sendEmailText}</p>
					<Localization
						className="form"
						localizationDictionary={this.dictionary}>
						<div className="form">
							<div className="form-group">
								<LocalizationLabel
									htmlFor="email"
									className="control-label"
									dictionaryName="email"/>
								<LocalizationField
									tabIndex="1"
									className="control-field"
									name="email"
									control={inputTextCtrl}
									dictionaryName="email"
									fromPlaceholder={true}/>
								<button type="submit" className="btn btn-primary btn-send">
									{buttons.send}
								</button>
							</div>
						</div>
					</Localization>
				</Form>
				}

				<div className="skip-app">
					<p>{skipAppText}</p>
					<div className="skip-app-buttons-group">
						<button
							type="button"
							className="btn btn-primary skip-app-btn"
							onClick={this.onSkipApp}>
							{buttons.skipApp}
						</button>
					</div>
				</div>
			</div>
		);
	}
}
