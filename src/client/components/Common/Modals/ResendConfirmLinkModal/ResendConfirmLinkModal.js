import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {ModalDictionary} from '../../../Common/ModalProvider';
import './ResendConfirmLinkModal.scss';

@withRouter
@inject('modalStore', 'localizationStore')
export default class ResendConfirmLinkModal extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('ResendConfirmLinkModal');
	}

	onLogIn = () => {
		this.props.modalStore.close();
		this.props.history.push(`/?${ModalDictionary.login.prop}`);
	};

	onResendLink = () => {
		// todo add request to resend confirm link
		this.props.modalStore.close();
	};

	render() {
		const {
			alreadyInUseText,
			descriptions,
			resendText,
			buttons
		} = this.dictionary;

		return (
			<div>
				<p>
					{alreadyInUseText}
				</p>
				<ul className="items-list">
					<li>
						{descriptions[0]}
						&nbsp;
						<button className="btn btn-link" onClick={this.onLogIn}>
							{buttons.signIn}
						</button>
						.
					</li>
					<li>
						{descriptions[1]}
					</li>
				</ul>
				<p>
					{resendText}
				</p>

				<div className="buttons-group">
					<button
						type="button"
						className="btn btn-primary"
						onClick={this.onResendLink}>
						{buttons.resend}
					</button>
				</div>
			</div>
		);
	}
}
