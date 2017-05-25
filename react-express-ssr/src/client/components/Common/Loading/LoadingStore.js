import {observable, action} from 'mobx';

class LoadingStore {
	body = null;

	@observable loading = false;

	@action startLoading() {
		if (typeof document !== 'undefined') {
			if (this.body === null) {
				this.body = document.body;
			}
			document.body.classList.add('substrate-open');
		}
		this.loading = true;
	}

	@action stopLoading() {
		if (typeof document !== 'undefined') {
			document.body.classList.remove('substrate-open');
		}
		this.loading = false;
	}
}
export default new LoadingStore();
