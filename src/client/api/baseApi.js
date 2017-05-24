import axios from 'axios';
import {loadingStore} from '../components/Common/Loading';
import {config} from './apiConfig';
import {ModalDictionary} from './../components/Common/ModalProvider/ModalDictionary';

let browserHistory;

export function setHistory(history) {
	browserHistory = history;
}

const baseApi = {
	ajax(request, params) {
		let promise = axios({...config, ...request});

		if (params && params.showLoading) {
			loadingStore.startLoading();
		}

		promise
			.then((res) => {
				loadingStore.stopLoading();
				return res;
			})
			.catch((error) => {
				if (error.response === undefined || (error.response && error.response.status >= 500)) {
					browserHistory.push(`${browserHistory.location.pathname}?${ModalDictionary.issue.prop}`);
				}
				loadingStore.stopLoading();
			});

		return promise;
	},

	setAuthorizationHeader(token) {
		axios.defaults.headers.common.Authorization = token;
	}
};

export default baseApi;
