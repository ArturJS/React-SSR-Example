import baseApi from './baseApi';
import {userStore} from '../stores';

export const loginApi = {
	doSignIn(email, password) {
		return baseApi.ajax({
			method: 'post',
			url: '/login',
			data: {
				email,
				password
			}
		})
			.then(res => res.data)
			.then(getProcessResponseFn(email));
	},

	doSignOut() {
		return new Promise((res) => {
			res();
		}).then(() => {
			userStore.resetUserData();
		});
	},

	doSignUp(email, password = null) {
		return baseApi.ajax({
			method: 'post',
			url: '/registration',
			data: {
				email,
				password
			}
		})
			.then(res => res.data)
			.then(getProcessResponseFn(email));
	}
};

function getProcessResponseFn(email) {
	return data => {
		const {role, applicationStatus} = data;
		const userData = {
			email,
			authToken: `${data.token_type} ${data.access_token}`,
			expiresIn: data.expires_in
		};
		// todo update token mapping
		// todo 401 processing with refresh_token
		userStore.setUserData(userData);

		return {
			role,
			applicationStatus
		};
	};
}
