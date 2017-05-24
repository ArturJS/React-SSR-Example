import {
	observable,
	extendObservable,
	action
} from 'mobx';
import baseApi from './../api/baseApi';
import _ from 'lodash';

class UserStore {
	@observable userData = {
		email: null,
		company: null,
		fullName: null,
		phone: null,
		authToken: null
	};

	_onInitPromise;
	_onInitResolve;
	@observable _isStoreInitialized = false;

	constructor() {
		this._onInitPromise = new Promise((res, rej) => {
			this._onInitResolve = res;
		});
	}

	startStore() {
		let userData = localStorage.getItem('userData');

		if (userData) {
			this.setUserData(JSON.parse(userData));
		}

		this._onInitResolve(this.userData);
		this._isStoreInitialized = true;
	}

	onInitialized() {
		return this._onInitPromise;
	}

	// methods

	@action setUserData(data) {
		extendObservable(this.userData, _.omit(data, ['expiresIn']));
		localStorage.setItem('userData', JSON.stringify(_.omit(this.userData, ['authToken', 'expiresIn'])));

		if (data.authToken) {
			localStorage.setItem('authData', JSON.stringify({
				authToken: data.authToken,
				expiresIn: Date.now() + data.expiresIn * 1000
			}));

			if (data.authToken) {
				baseApi.setAuthorizationHeader(data.authToken);
			}
		}
		else {
			let authData = localStorage.getItem('authData');
			if (authData) {
				authData = JSON.parse(authData);
				if (authData.expiresIn > Date.now()) {
					this.userData.authToken = authData.authToken;
					baseApi.setAuthorizationHeader(authData.authToken);
				}
				else {
					localStorage.removeItem('authData');
				}
			}
		}
	}

	getUserData() {
		return this.userData;
	}

	resetUserData() {
		extendObservable(this.userData, {
			email: null,
			company: null,
			fullName: null,
			phone: null,
			authToken: null
		});

		localStorage.removeItem('userData');
		localStorage.removeItem('authData');
		baseApi.setAuthorizationHeader(null);
	}

	resetAuthData() {
		extendObservable(this.userData, {
			authToken: null
		});

		localStorage.removeItem('authData');
		baseApi.setAuthorizationHeader(null);
	}

	get isLoggedIn() {
		return !!this.userData.authToken;
	}

	get isInitialized() {
		return this._isStoreInitialized;
	}
}

export default new UserStore();
