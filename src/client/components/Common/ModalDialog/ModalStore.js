import {observable, action} from 'mobx';

export const MODAL_TYPES = {
	error: 'ERROR_MODE',
	confirm: 'CONFIRM_MODE',
	info: 'INFO_MODE',
	custom: 'CUSTOM_MODE'
};

class ModalStore {
	@observable title;
	@observable body;
	@observable isOpen;
	@observable modalType;
	@observable modalClassName;
	@observable noBackdrop;

	_modalResult;
	_resolve;

	constructor() {
		this._resetFields();
	}

	_resetFields() {
		this.title = null;
		this.body = null;
		this.isOpen = false;
		this.modalType = null;
		this.modalClassName = null;
		this._modalResult = new Promise((res, rej) => {
			this._resolve = res;
		});
		this.noBackdrop = false;
	}

	@action showError(title, errors) {
		this._showModal({
			title,
			body: errors,
			modalType: MODAL_TYPES.error,
			className: 'modal-error',
			noBackdrop: true
		});

		return this._modalResult;
	}

	@action showConfirm(title, message) {
		this._showModal({
			title,
			body: message,
			modalType: MODAL_TYPES.confirm,
			className: 'modal-confirm'
		});

		return this._modalResult;
	}

	@action showInfo(title, message) {
		this._showModal({
			title,
			body: message,
			modalType: MODAL_TYPES.info,
			className: 'modal-info'
		});

		return this._modalResult;
	}

	@action showCustom(title, component, className = '') {
		this._showModal({
			title,
			body: component,
			modalType: MODAL_TYPES.custom,
			className: `modal-custom ${className}`
		});

		return this._modalResult;
	}

	@action close(result = false) {
		this._resolve(result);
		this._resetFields();
	}

	_showModal({title, body, modalType, className, noBackdrop}) {
		this.isOpen = true;
		this.title = title;
		this.body = body;
		this.modalType = modalType;
		this.noBackdrop = noBackdrop;
		this.modalClassName = className;
	}
}

export default new ModalStore();
