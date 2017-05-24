import React from 'react';
import {
	LoginModal,
	IssueModal
} from '../../Common/Modals';

export const ModalDictionary = {
	login: {
		prop: 'login-modal',
		regex: /login-modal/,
		component: <LoginModal/>
	},
	issue: {
		prop: 'issue-modal',
		regex: /issue-modal/,
		component: <IssueModal/>
	}
};
