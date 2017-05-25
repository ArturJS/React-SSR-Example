import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import './IssueModal.scss';


@inject('modalStore', 'localizationStore')
export default class IssueModal extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired
	};

	state = {
		errors: null
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('IssueModal');
	}

	render() {
		let reason = this.dictionary.reason.map((item, index) => <p className="phrase" key={index}>{item}</p>);
		return (
			<div className="issue-modal">
				<div>
					{reason}
					<p>{this.dictionary.thanks}</p>
				</div>
				<span className="red-angle"/>
			</div>
		);
	}
}
