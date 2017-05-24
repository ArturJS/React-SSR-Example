import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {loginApi} from '../../../api/loginApi';
import {ModalDictionary} from '../../Common/ModalProvider';
import {withRouter} from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';
import './UserAuthState.scss';

@withRouter
@inject('userStore', 'modalStore', 'localizationStore')
@observer
export default class UserAuthState extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		userStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired
	};

	state = {
		visible: false
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('UserAuthState');
	}

	componentDidMount() {
		this.updateVisibility(this.props.history.location);
		this.unlisten = this.props.history.listen(this.updateVisibility);
	}

	componentWillUnmount() {
		this.unlisten();
	}

	updateVisibility = (location) => {
		this.setState({
			visible: _.includes(location.pathname, 'my-referral-applications')
		});
	};

	login = () => {
		this.props.history.push(`/?${ModalDictionary.login.prop}`);
	};

	logout = () => {
		loginApi.doSignOut()
			.then(() => {
				this.props.history.push('/');
			});
	};

	render() {
		const {buttons} = this.dictionary;
		const {userStore} = this.props;
		const {isLoggedIn} = userStore;
		const {email} = userStore.getUserData();
		const {visible} = this.state;

		return (
			<div className={classNames('user-auth-state', {'hide': !visible})}>
				{isLoggedIn &&
				<div className="logged-in">
					<div className="email">
						{email}
					</div>
					<button
						className="btn btn-link"
						onClick={this.logout}>
						{buttons.logout}
					</button>
				</div>
				}
				{!isLoggedIn &&
				<div className="logged-out">
					<button
						className="btn btn-link"
						onClick={this.login}>
						{buttons.login}
					</button>
				</div>
				}
			</div>
		);
	}
}
