import FormStore from './FormStore';
import Validators from './utils/Validators';
import {observable} from 'mobx';

describe('FormStore', () => {

	describe('constructor', () => {
		it('should initialize controls by default', () => {
			const form = new FormStore({
				field: {value: 1}
			});

			expect(form.ctrls.field).toEqual({
				value: 1,
				error: null,
				validators: observable([]),
				asyncValidators: observable([]),
				transform: form.ctrls.field.transform
			});

			expect(form.ctrls.field.transform(123)).toBe(123);
		});
	});

	describe('api methods', () => {
		let formStore;
		const errorMessages = {
			email: 'Email is required',
			password: 'Password is required'
		};
		const alreadyExistingEmail = 'user@user.com';
		const asyncEmailErrorMessage = 'Such email already exists';

		beforeEach(() => {
			formStore = new FormStore({
				email: {
					value: '',
					options: {
						isAsyncValidatingInProgress: false
					},
					validators: [
						Validators.required(errorMessages.email)
					],
					asyncValidators: [
						(value, values) => {
							return new Promise((resolve, reject) => {
								if (value === alreadyExistingEmail) {
									reject(asyncEmailErrorMessage);
								}
								else {
									resolve('Ok');
								}
							});
						}
					]
				},
				password: {
					value: '',
					validators: [
						Validators.required(errorMessages.password)
					]
				}
			});
		});

		it('should be able to setFormData and getValues', () => {
			const formData = {
				email: 'user@user.com',
				password: '12345'
			};

			formStore.setFormData(formData);
			expect(formStore.getValues()).toEqual(formData);
		});

		it('should be able to validate and return errors for incorrect form data', () => {
			const formData = {
				email: '',
				password: ''
			};

			formStore.setFormData(formData);
			expect(formStore.validate()).toEqual({
				valid: false,
				errors: errorMessages
			});
		});

		it('should be able to validate and NOT return errors for correct form data', () => {
			const formData = {
				email: 'user@user.com',
				password: '12345'
			};

			formStore.setFormData(formData);
			expect(formStore.validate()).toEqual({
				valid: true,
				errors: {}
			});
		});

		it(`should be able to asyncValidateCtrl and return error for already existing ${alreadyExistingEmail} email`, () => {
			const formData = {
				email: alreadyExistingEmail,
				password: '12345'
			};

			formStore.setFormData(formData);

			return formStore.asyncValidateCtrl('email').then(()=> {
				expect(formStore.ctrls.email.error).toBe(asyncEmailErrorMessage);
				expect(formStore.ctrls.email.isAsyncValidatingInProgress).toBeFalsy();
			});
		});

		it(`should be able to asyncValidateCtrl and NOT return error for not existing email`, () => {
			const formData = {
				email: 'not@existing.com',
				password: '12345'
			};

			formStore.setFormData(formData);

			return formStore.asyncValidateCtrl('email').then(()=> {
				expect(formStore.ctrls.email.error).toBe(null);
				expect(formStore.ctrls.email.isAsyncValidatingInProgress).toBeFalsy();
			});
		});
	});
});
