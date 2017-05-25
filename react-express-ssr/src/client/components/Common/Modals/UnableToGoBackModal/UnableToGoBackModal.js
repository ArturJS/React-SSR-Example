import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {ModalDictionary} from '../../../Common/ModalProvider';
import './UnableToGoBackModal.scss';

@withRouter
@inject('modalStore', 'localizationStore')
export default class UnableToGoBackModal extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('UnableToGoBackModal');
	}

	onLogIn = () => {
		this.props.modalStore.close();
		this.props.history.push(`/?${ModalDictionary.login.prop}`);
	};

	onClose = () => {
		this.props.modalStore.close();
	};

	render() {
		const {
			alreadySubmittedText,
			signInText,
			buttons
		} = this.dictionary;

		return (
			<div>
				<p>
					{alreadySubmittedText}
				</p>
				<p>
					{signInText}
					&nbsp;
					<button className="btn btn-link" onClick={this.onLogIn}>
						{buttons.signIn}
					</button>
					.
				</p>

				<div className="buttons-group">
					<button
						type="button"
						className="btn btn-primary"
						onClick={this.onClose}>
						{buttons.ok}
					</button>
				</div>
			</div>
		);
	}
}
