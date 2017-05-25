import {observable, action} from 'mobx';
import _ from 'lodash';

export default class FormStore {
	@observable ctrls = {};

	constructor(controls) {
		let ctrls = {...controls};
		_.forOwn(ctrls, (ctrl, name) => {
			ctrl.error = null;
			ctrl.validators = ctrl.validators || [];
			ctrl.asyncValidators = ctrl.asyncValidators || [];
			ctrl.transform = ctrl.transform || (v => v);
			ctrl.onFocusTransform = ctrl.onFocusTransform || (v => v);
			ctrl.onBlurTransform = ctrl.onBlurTransform || (v => v);
			ctrl.onChanged = ctrl.onChanged || _.noop;
		});
		this.ctrls = observable(ctrls);
	}

	// methods

	@action setFormData(data) { // todo probably make sense to add flag "quiet" (if "quiet" is false then invoke ctrl.onChanged())
		_.forOwn(data, (value, name) => {
			this.ctrls[name].value = value;
		});
	}

	@action validate() {
		let errors = {};
		_.forOwn(this.ctrls, (ctrl, name) => {
			let error = this.validateCtrl(name);
			if (error) {
				errors[name] = error;
			}
		});
		return {
			valid: _.isEmpty(errors),
			errors
		};
	}

	@action validateCtrl(name) {
		let ctrl = this.ctrls[name];
		let values = this.getValues();

		for (let validator of ctrl.validators) {
			ctrl.error = validator(ctrl.value, values, ctrl);
			if (ctrl.error) {
				return ctrl.error;
			}
		}
		return null;
	}


	@action asyncValidateCtrl(name) {
		let ctrl = this.ctrls[name];
		if (!ctrl.error) {
			let values = this.getValues();
			let promises = [];

			if (ctrl.options) {
				ctrl.options.isAsyncValidatingInProgress = true;
			}

			for (let validator of ctrl.asyncValidators) {
				promises.push(validator(ctrl.value, values, ctrl));
			}

			return Promise
				.all(promises)
				.then(
					() => this.asyncValidatingDone(null, ctrl),
					error => this.asyncValidatingDone(error, ctrl)
				);
		}
	}

	@action mergeConfiguration(configuration) {
		_.forOwn(this.ctrls, (ctrl, name) => {
			ctrl.error = null;
			if (configuration[name]) {
				ctrl.options = {...ctrl.options, ...configuration[name].options};
				ctrl.validators = configuration[name].validators;
				if (configuration.value === '') {
					ctrl.value = '';
				}
			}
		});
	}

	setFocus(name, immediately) {
		if (immediately) {
			this.ctrls[name].ref.focus();
		}
		else {
			setTimeout(() => { // necessary in case of disabled fields
				this.ctrls[name].ref.focus();
			}, 50);
		}
	}

	setFocusFirstEmpty() {
		for (let ctrl in this.ctrls) {
			if (_.isEmpty(this.ctrls[ctrl].value)) {
				this.ctrls[ctrl].ref.focus();
				break;
			}
		}
	}

	getFirstInvalidCtrl() {
		for (let ctrl in this.ctrls) {
			if (this.ctrls[ctrl].error) {
				return this.ctrls[ctrl];
			}
		}
	}

	isHaveEmptyValue() {
		for (let ctrl in this.ctrls) {
			if (_.isEmpty(this.ctrls[ctrl].value)) {
				return true;
			}
		}
		return false;
	}

	asyncValidatingDone(error, ctrl) {
		ctrl.error = error;
		ctrl.options.isAsyncValidatingInProgress = false;
	}

	getValues() {
		let values = {};
		_.forOwn(this.ctrls, (ctrl, name) => {
			values[name] = ctrl.value;
		});
		return values;
	}
}
