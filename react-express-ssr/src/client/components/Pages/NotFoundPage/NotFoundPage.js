import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import './NotFoundPage.scss';

@inject('localizationStore')
@observer
export default class NotFoundPage extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired
	};


	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('NotFoundPage');
	}

	render() {
		return (
			<div className="not-found ">
				<div className="message">
					<h1 className="page-title">{this.dictionary.title}</h1>
					<hr className="divider"/>
					<p className="page-subtitle">
						{this.dictionary.subtitle}
					</p>
				</div>
				<div className="shell-footer">
					<Link
						className="unstyled-link btn btn-primary btn-continue"
						to="/">{this.dictionary.buttons.ok}</Link>
				</div>
			</div>
		);
	}
}
