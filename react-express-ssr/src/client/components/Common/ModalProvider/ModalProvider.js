import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {ModalDialog} from './../ModalDialog';
import {ModalDictionary} from './ModalDictionary';

@inject('modalStore', 'userStore', 'localizationStore')
@observer
@withRouter
export default class ModalProvider extends Component {
	static propTypes = {
		modalStore: PropTypes.object.isRequired,
		userStore: PropTypes.object.isRequired,
		localizationStore: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
		this.loginModalTitle = this.props.localizationStore.getPage('LandingPage').loginModalTitle;
		this.issueModalTitle = this.props.localizationStore.getPage('IssueModal').title;
	}

	componentDidMount() {
		this.props.userStore.onInitialized().then(() => {
			this.props.history.listen(this.pathChanged);
			this.pathChanged(this.props.history.location);
		});
	}

	dictionary = ModalDictionary;

	pathChanged = (e) => {
		if (this.dictionary.issue.regex.test(e.search) || !navigator.onLine) {
			this.props.modalStore.showCustom(this.issueModalTitle, this.dictionary.issue.component, 'issue-modal-dialog')
				.then(() => {
					this.props.history.push(e.pathname);
				});
		}
		else if (!this.props.userStore.isLoggedIn) {
			if (this.dictionary.login.regex.test(e.search)) {
				this.props.modalStore.showCustom(this.loginModalTitle, this.dictionary.login.component);
			}
		}
		else if (this.props.modalStore.isOpen) {
			this.props.modalStore.close();
		}
	};


	render() {
		return <ModalDialog/>;
	}
}
