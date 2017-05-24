import React, {Component} from 'react';

import Header from './Common/Header/Header';

export default class ContentShell extends Component {
	render() {
		return (
			<div className="App">
				<Header/>

				<div className="page container">
					{this.props.children}
				</div>
			</div>
		);
	}
}
