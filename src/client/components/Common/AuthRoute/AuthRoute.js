import React, {Component} from 'react';
import {Redirect, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';

@inject('userStore')
@observer
export default class AuthRoute extends Component {
	static propTypes = {
		userStore: PropTypes.object.isRequired
	};

	render() {
		const {userStore, component} = this.props;
		const {isLoggedIn, isInitialized} = userStore;

		if (!isInitialized) return null;

		return (
			isLoggedIn ? <Route {...this.props} component={component}/> : <Redirect to="/404"/>
		);
	}
}
