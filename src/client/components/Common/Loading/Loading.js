import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import './Loading.scss';
import PropTypes from 'prop-types';

@inject('loadingStore')
@observer
export default class Loading extends Component {
	static propTypes = {
		loadingStore: PropTypes.object.isRequired
	};

	render() {
		return (
			<div>
				{this.props.loadingStore.loading &&
				<div className="loading-screen">
					<div className="loader"/>
				</div>
				}
			</div>
		);
	}
}
