import React, {Component} from 'react';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';

import {withRouter} from 'react-router';
import {ModalProvider} from './Common/ModalProvider';
import {Loading} from './Common/Loading';
import {setHistory} from './../api/baseApi';

@withRouter
@inject('userStore')
export default class BaseShell extends Component {
	static propTypes = {
		userStore: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
		setHistory(props.history);
	}

	componentDidMount() {
		this.props.userStore.startStore();
	}

	render() {
		return (
			<div>
				<Loading/>
				{this.props.children}
				<ModalProvider/>
			</div>
		);
	}
}
