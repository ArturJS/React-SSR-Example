// Libs
import React, {Component} from 'react';
import animate from 'amator';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {BASE, SCHEMAS_DIC, EMIRIAN, NON_EMIRIAN} from '../../../constants/fileSchemas';
import _ from 'lodash';

// Constants
import {AE_PHONE_PREFIX, AE_MOBILE_PHONE_PREFIX, EMIRATES_PREFIX, FILE_EXTENSIONS} from './../../../constants/common';

// APIs
import {applicationFormApi} from '../../../api/applicationFormApi';
import {dictionaryApi} from '../../../api/dictionaryApi';

// Common components
import {Form, FormStore, Validators, Transformers} from '../../Common/Form';
import {Localization} from './../../Common/Localization';
import ErrorSummary from './../../Common/ErrorSummary';
import {AppReceivedModal, UnableToGoBackModal} from '../../Common/Modals';
import processErrors from '../../Common/ProcessErrors';
import restoreFormData from '../../Common/RestoreFormData';
import Documents from './Components/Documents';
import BusinessDetails from './Components/BusinessDetails';
import Ownership from './Components/Ownership';

// Styles
import './ApplicationFormPage.scss';

const fileConfig = {
	sizeError: false,
	extensions: FILE_EXTENSIONS
};

function isLLC(companyName) {
	if (!companyName) return false;

	const checkValue = companyName.toUpperCase();
	return checkValue.indexOf('LLC') >= 0 || checkValue.indexOf('L.L.C') >= 0;
}

function isNotDraft(status) {
	return _.isString(status) && status.toUpperCase() !== 'DRAFT';
}

function isDraft(status) {
	return !isNotDraft(status);
}

const PAGE_NAME = 'APPLICATION_FORM';

@restoreFormData
@processErrors
@withRouter
@inject('localizationStore', 'modalStore', 'userStore', 'loadingStore')
@observer
export default class ApplicationFormPage extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired,
		userStore: PropTypes.object.isRequired,
		loadingStore: PropTypes.object.isRequired,
		match: PropTypes.object.isRequired,
		errors: PropTypes.array,
		setErrors: PropTypes.func.isRequired,
		processAjaxError: PropTypes.func.isRequired,
		saveFormData: PropTypes.func.isRequired,
		getFormData: PropTypes.func.isRequired,
		removeFormData: PropTypes.func.isRequired,
		history: PropTypes.object.isRequired
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('ApplicationFormPage');
		const {
			applicationStatusByDefault,
			validators
		} = this.dictionary;

		this.fileValidators = [
			Validators.formatValidator(this.dictionary.formatError),
			Validators.sizeValidator(this.dictionary.fileSizeError),
			Validators.maxFilesSizeMB(this.maxFileSize, this.dictionary.notice)
		];

		let mainComponent = this;

		this.businessDetailsFormStore = new FormStore({
			status: {
				value: applicationStatusByDefault
			},
			places: {
				value: '',
				options: {
					viewValue: ''
				},
				onChanged: (ctrl, ctrls) => {
					ctrls.streetName.value = '';
					ctrls.legalName.value = '';
					ctrls.website.value = '';
					ctrls.companyPhone.value = '';
					ctrls.postOfficeBox.value = '';
					ctrls.city.value = '';

					if (_.isString(ctrl.value.formatted_address)) {
						ctrls.streetName.value = ctrl.value.formatted_address.split(/[^A-Za-z.\-,:0-9\s]/).join(''); // get rid of not allowed symbols
					}
					ctrls.legalName.value = ctrl.value.name;
					ctrls.legalName.onChanged(ctrls.legalName, ctrls);
					ctrls.website.value = ctrl.value.website;

					ctrls.streetName.error = null;
					ctrls.legalName.error = null;
					ctrls.website.error = null;

					let city = _.find(
						ctrl.value.address_components,
						(addressItem) => addressItem.types[0] === 'administrative_area_level_1'
					);

					if (city) {
						ctrls.city.value = city.long_name;
						ctrls.city.error = null;
					}

					let poBoxGroups = /Post Box no: (\d+)/.exec(ctrl.value.formatted_address);
					if (poBoxGroups && poBoxGroups[1]) {
						ctrls.postOfficeBox.value = poBoxGroups[1];
						ctrls.postOfficeBox.error = null;
					}

					if (ctrl.value.international_phone_number) {
						ctrls.companyPhone.value = ctrl.value.international_phone_number.split(AE_PHONE_PREFIX).join('').trim();
						ctrls.companyPhone.error = null;
					}

					this.saveToLocalStorage();
				}
			},
			streetName: { // todo rename to address
				value: '',
				maxLength: 40,
				onBlured: this.saveToLocalStorage,
				validators: [
					Validators.required(validators.streetName.required),
					Validators.regex(/^([A-Za-z.\-,:0-9]\s*)+$/, validators.streetName.regex)
				]
			},
			postOfficeBox: {
				value: '',
				onBlured: this.saveToLocalStorage,
				transform: Transformers.numberWithLength(7),
				validators: [
					Validators.required(validators.postOfficeBox.required),
					Validators.number(validators.postOfficeBox.number)
				]
			},
			city: {
				value: '',
				onBlured: this.saveToLocalStorage,
				options: [],
				validators: [
					Validators.required(validators.city.required)
				]
			},
			country: {
				value: 'United Arab Emirates',
				disabled: true,
				onBlured: this.saveToLocalStorage,
				validators: [
					Validators.required(validators.country.required)
				]
			},
			companyPhone: {
				value: '',
				options: {
					prefix: AE_PHONE_PREFIX
				},
				onBlured: this.saveToLocalStorage,
				onFocusTransform: Transformers.phoneOnFocus,
				onBlurTransform: Transformers.phoneOnBlur,
				transform: Transformers.phone,
				validators: [
					Validators.required(validators.companyPhone.required),
					Validators.phoneValidator(validators.companyPhone.invalid)
				]
			},
			website: {
				value: '',
				maxLength: 63,
				onBlured: this.saveToLocalStorage,
				validators: [
					Validators.website(validators.website.invalid)
				]
			},
			legalName: {
				value: '',
				maxLength: 30,
				onChanged: (ctrl, ctrls) => {
					const checkValue = ctrl.value.toUpperCase();

					if (isLLC(checkValue) && ctrls.entityType.value === '') {
						ctrls.entityType.value = 'LLC';
						ctrls.entityType.error = null;
					}

					if (!ctrls.merchantNameCheckbox.value) {
						ctrls.merchantName.value = ctrl.value;
						ctrls.merchantName.error = null;
					}
				},
				onBlured: this.saveToLocalStorage,
				validators: [
					Validators.required(validators.legalName.required),
					Validators.name(validators.legalName.name)
				]
			},
			entityType: {
				onChanged: (ctrl, ctrls) => {
					mainComponent.invalidateDocumentSection();
				},
				value: '',
				onBlured: this.saveToLocalStorage,
				options: [],
				validators: [
					Validators.required(validators.entityType.required)
				]
			},
			merchantName: { // trading as
				value: '',
				maxLength: 30,
				disabled: true,
				onBlured: this.saveToLocalStorage,
				validators: [
					Validators.required(validators.merchantName.required),
					Validators.name(validators.merchantName.name)
				]
			},
			merchantNameCheckbox: { // trading as checkbox
				value: false,
				onChanged: (ctrl, ctrls) => {
					ctrls.merchantName.disabled = !ctrl.value;
					ctrls.merchantName.value = ctrl.value ? '' : ctrls.legalName.value;
					ctrls.merchantName.error = null;

					if (ctrl.value) {
						this.businessDetailsFormStore.setFocus('merchantName');
					}

					this.saveToLocalStorage();
				}
			},

			businessSize: { // annual turnover
				value: '',
				onBlured: this.saveToLocalStorage,
				options: [],
				validators: [
					Validators.required(validators.businessSize.required)
				]
			},
			businessTypeCategory: { // business nature
				value: '',
				onBlured: this.saveToLocalStorage,
				options: {
					data: {} // necessary for immediate attaching of Object like lists of options
				},
				validators: [
					Validators.required(validators.businessTypeCategory.required)
				],
				onChanged: (ctrl, ctrls) => {
					let {businessTypeDescription, businessTypeMCCID} = ctrls;

					businessTypeDescription.options.data = ctrl.options.data[ctrl.value];

					if (businessTypeDescription.options.data.length === 1) {
						businessTypeDescription.value = businessTypeDescription.options.data[0].name;
						businessTypeDescription.error = null;
					}
					else {
						businessTypeDescription.value = '';
					}

					businessTypeDescription.disabled = false;
					businessTypeMCCID.value = '';
				}
			},
			businessTypeDescription: { // business line
				value: '',
				onBlured: this.saveToLocalStorage,
				options: {
					data: {} // necessary for immediate attaching of Object like lists of options
				},
				disabled: true,
				onChanged: (ctrl, ctrls) => {
					let {businessTypeMCCID} = ctrls;

					businessTypeMCCID.value = ctrl.options.data.find(item => item.name === ctrl.value).value;
				},
				validators: [
					Validators.required(validators.businessTypeDescription.required)
				]
			},
			businessTypeMCCID: {
				value: '',
				onBlured: this.saveToLocalStorage
			},
			countEmployees: { // No. of employees
				value: '',
				options: [],
				onBlured: this.saveToLocalStorage,
				validators: [
					Validators.required(validators.countEmployees.required),
					Validators.minValue(0, validators.countEmployees.minValue)
				]
			},
			countOutlets: { // No. of Outlets
				value: '1',
				onBlured: this.saveToLocalStorage,
				transform: Transformers.positiveNumberWithLength(4),
				validators: [
					Validators.required(validators.countOutlets.required),
					Validators.minValue(0, validators.countOutlets.minValue)
				]
			}
		});

		this.ownershipFormStore = new FormStore({
			firstName: {
				value: '',
				maxLength: 254,
				validators: [
					Validators.required(validators.firstName.required),
					Validators.regex(/^[a-zA-Z\s]+$/, validators.firstName.regex)
				],
				onBlured: this.saveToLocalStorage
			},
			lastName: {
				value: '',
				maxLength: 254,
				validators: [
					Validators.required(validators.lastName.required),
					Validators.regex(/^[a-zA-Z\s]+$/, validators.lastName.regex)
				],
				onBlured: this.saveToLocalStorage
			},
			nationality: {
				onChanged: (ctrl, ctrls) => {
					mainComponent.invalidateDocumentSection();
				},
				value: '',
				options: [],
				validators: [
					Validators.required(validators.nationality.required)
				],
				onBlured: this.saveToLocalStorage
			},
			emiratesId: {
				value: '',
				options: {
					prefix: EMIRATES_PREFIX
				},
				transform: Transformers.emiratesID,
				validators: [
					Validators.emiratesID(validators.emiratesId.emiratesID)
				],
				onBlured: this.saveToLocalStorage
			},
			mobileNumber: {
				value: '',
				options: {
					prefix: AE_MOBILE_PHONE_PREFIX
				},
				onFocusTransform: Transformers.phoneOnFocus,
				onBlurTransform: Transformers.mobilePhoneOnBlur,
				transform: Transformers.mobilePhone,
				validators: [
					Validators.required(validators.mobileNumber.required),
					Validators.mobilePhoneValidator(validators.mobileNumber.invalid)
				],
				onBlured: this.saveToLocalStorage
			}
		});

		this.documentsFormStore = new FormStore(this.createConfigByScheme(BASE, this.fileValidators, true));
	}

	async componentDidMount() {
		this.fillUserInfoFromLocalStorage();

		window.addEventListener('popstate', this.onBrowserBack);
		window.addEventListener('pushstate', this.onPushState);

		// set focus
		if (this.businessDetailsFormStore.isHaveEmptyValue()) {
			this.businessDetailsFormStore.setFocusFirstEmpty();
		}
		else {
			this.ownershipFormStore.setFocusFirstEmpty();
		}

		// set initial values
		let {
			businessSizes,
			countEmployees
		} = await this.getDictionaries();
		this.businessDetailsFormStore.ctrls.businessSize.value = businessSizes[0].value;
		this.businessDetailsFormStore.ctrls.countEmployees.value = countEmployees[0].value;

		// receive data and fill form
		try {
			await this.getFormData();
		}
		finally {
			this.invalidateDocumentSection();

			const businessCtrls = this.businessDetailsFormStore.ctrls;

			if (businessCtrls.businessTypeCategory.value) {
				businessCtrls.businessTypeCategory.onChanged(businessCtrls.businessTypeCategory, businessCtrls);
			}

			if (businessCtrls.businessTypeDescription.value) {
				businessCtrls.businessTypeDescription.disabled = false;
			}
		}
	}

	componentWillUnmount() {
		this.props.userStore.resetAuthData();
	}

	setFocusFirstInvalidField = () => {
		let ctrl;
		if (!this.businessDetailsFormStore.validate().valid) {
			ctrl = this.businessDetailsFormStore.getFirstInvalidCtrl();
		}
		else if (!this.ownershipFormStore.validate().valid) {
			ctrl = this.ownershipFormStore.getFirstInvalidCtrl();
		}
		else {
			return;
		}

		this.scrollIntoViewAndFocusCtrl(ctrl);
	};

	async getDictionaries() {
		let [
			emirates,
			nationalities,
			mccs,
			entityTypes,
			businessSizes,
			countEmployees
		] = await Promise.all([
			dictionaryApi.getEmirates(),
			dictionaryApi.getNationalities(),
			dictionaryApi.getMCCs(),
			dictionaryApi.getEntityTypes(),
			dictionaryApi.getBusinessSizes(),
			dictionaryApi.getCountEmployees()
		]);

		this.businessDetailsFormStore.ctrls.entityType.options.replace(entityTypes);
		this.businessDetailsFormStore.ctrls.businessSize.options.replace(businessSizes);
		this.businessDetailsFormStore.ctrls.businessTypeCategory.options.data = mccs;
		this.businessDetailsFormStore.ctrls.city.options.replace(emirates);
		this.businessDetailsFormStore.ctrls.countEmployees.options.replace(countEmployees);
		this.ownershipFormStore.ctrls.nationality.options.replace(nationalities);

		return {
			emirates,
			nationalities,
			mccs,
			entityTypes,
			businessSizes,
			countEmployees
		};
	}

	async getFormData() {
		this.restoreFromLocalStorage();

		let formData = await applicationFormApi.getFormData(EMIRATES_PREFIX, AE_PHONE_PREFIX, AE_MOBILE_PHONE_PREFIX);

		if (isNotDraft(formData.status)) {
			this.props.removeFormData(this.props.userStore.getUserData().email, PAGE_NAME);
		}

		this.businessDetailsFormStore.setFormData(formData.businessDetails);

		if (formData.businessDetails.businessTypeDescription) {
			let {ctrls} = this.businessDetailsFormStore;
			ctrls.businessTypeCategory
				.onChanged(
					ctrls.businessTypeCategory,
					ctrls
				);

			ctrls.businessTypeDescription.value = formData.businessDetails.businessTypeDescription;
		}

		this.ownershipFormStore.setFormData(formData.ownership);

		if (formData.documents) {
			this.documentsFormStore.setFormData(formData.documents);
		}
	}


	onBrowserBack = () => {
		window.removeEventListener('popstate', this.onBrowserBack);

		// UnableToGoBackModal
		if (
			isNotDraft(this.businessDetailsFormStore.ctrls.status.value) &&
			this.props.history.location.pathname === '/create-account'
		) {
			this.props.history.goForward();

			this.props.modalStore.close({
				unableToGoBack: true
			});
			this.props.modalStore
				.showCustom('Unable to go back', <UnableToGoBackModal/>, 'unable-to-go-back-modal')
				.then(() => {
					if (this.isSentForApproval) {
						this.redirectToLandingPage();
					}
				});
		}
	};

	createConfigByScheme = (schema, fileValidators, initial) => {
		let documents = {};

		_.forOwn(schema, (item, name) => {
			let tmpValidators = [];
			if (!schema[name].hide) {
				tmpValidators = [...fileValidators];
				if (schema[name].required) {
					tmpValidators.push(Validators.required(this.dictionary.validators[name].required));
				}
			}

			if (initial || schema[name].hide) {
				documents[name] = {
					transform: Transformers.fileTransform,
					options: {...fileConfig, hide: schema[name].hide},
					value: '',
					validators: tmpValidators
				};
			}
			else {
				documents[name] = {
					transform: Transformers.fileTransform,
					options: {...fileConfig, hide: schema[name].hide},
					validators: tmpValidators
				};
			}
		});

		return documents;
	};

	invalidateDocumentSection() {
		let schema = BASE;
		if (SCHEMAS_DIC[this.businessDetailsFormStore.ctrls.entityType.value]) {
			schema = SCHEMAS_DIC[this.businessDetailsFormStore.ctrls.entityType.value];
			if (this.ownershipFormStore.ctrls.nationality.value === 'UAE') {
				schema = {...schema, ...EMIRIAN};
			}
			else {
				schema = {...schema, ...NON_EMIRIAN};
			}
		}

		this.documentsFormStore.mergeConfiguration(this.createConfigByScheme(schema, this.fileValidators));
	}

	onPushState = () => {
		window.removeEventListener('popstate', this.onBrowserBack);
		window.removeEventListener('pushstate', this.onPushState);
	};

	fillUserInfoFromLocalStorage = () => {
		this.props.userStore.onInitialized().then(({company, fullName, phone}) => {
			let mobileNumber = '';

			if (_.isString(phone)) {
				mobileNumber = phone.split(AE_MOBILE_PHONE_PREFIX).join('');
			}

			let firstName = '';
			let lastName = '';
			let fullNameRegexGroups = /(\S+)\s(.+)/.exec(fullName);

			if (fullName && fullNameRegexGroups) {
				[, firstName, lastName] = fullNameRegexGroups;
			}

			this.ownershipFormStore.setFormData({
				firstName,
				lastName,
				mobileNumber
			});

			this.businessDetailsFormStore.setFormData({
				legalName: company,
				entityType: isLLC(company) ? 'LLC' : '',
				merchantName: company
			});
		});
	};

	scrollIntoViewAndFocusCtrl = (ctrl) => {
		const {ref} = ctrl;

		this.scrollIntoView(ref.closest('.form-group'), () => {
			ref.focus();
		});
	};

	scrollToDocumentsBlock = () => {
		this.scrollIntoView('.documents-block');
	};

	scrollIntoView = (elementOrSelector, done = _.noop) => {
		const ref = _.isString(elementOrSelector) ? document.querySelector(elementOrSelector) : elementOrSelector;
		// document.body.scrollTop === 0 always in IE11 (and not changeable in IE11)
		const scrollElement = document.body.scrollTop === 0 ? document.documentElement : document.body;

		animate(scrollElement, {
			scrollTop: ref.offsetTop
		}, {
			duration: 400,
			easing: 'easeOut',
			done
		});
	};

	saveChanges = (documents = null) => {
		let businessDetailsResult = this.businessDetailsFormStore.validate();
		let ownershipResult = this.ownershipFormStore.validate();

		this.setFocusFirstInvalidField();

		if (!businessDetailsResult.valid || !ownershipResult.valid) return;

		applicationFormApi.postFormData({
			...this.businessDetailsFormStore.getValues(),
			contact: this.ownershipFormStore.getValues(),
			documents
		}, EMIRATES_PREFIX, AE_PHONE_PREFIX, AE_MOBILE_PHONE_PREFIX, {showLoading: true})
			.then((data) => {
				if (documents) {
					this.isSentForApproval = true; // necessary to redirect to landing page from "Unable to go back" modal
					// todo refactor
					this.props.modalStore
						.showCustom('Congratulations!', <AppReceivedModal
							isFullySubmitted={true}/>, 'app-received-modal')
						.then(({unableToGoBack}) => {
							if (unableToGoBack) return;

							this.redirectToLandingPage();
						});
				}
				else if (isDraft(this.businessDetailsFormStore.ctrls.status.value)) {
					this.props.modalStore
						.showCustom('Congratulations!', <AppReceivedModal/>, 'app-received-modal')
						.then(({unableToGoBack}) => {
							if (unableToGoBack) return;

							this.scrollToDocumentsBlock();
						});
				}
				else {
					this.props.modalStore.showInfo('Success', 'The changes have been saved.')
						.then(({unableToGoBack}) => {
							if (unableToGoBack) return;

							this.scrollToDocumentsBlock();
						});
				}


				this.businessDetailsFormStore.setFormData({
					status: data.status
				});

				this.props.removeFormData(this.props.userStore.getUserData().email, PAGE_NAME);
			})
			.catch(error => this.props.processAjaxError(error));
	};

	submit = (async () => {
		let documentsResult = this.documentsFormStore.validate();
		let businessDetailsResult = this.businessDetailsFormStore.validate();
		let ownershipResult = this.ownershipFormStore.validate();

		if (
			!businessDetailsResult.valid || !ownershipResult.valid || !documentsResult.valid
		) {
			this.setFocusFirstInvalidField();
			return false;
		}

		let formData = this.documentsFormStore.getValues();

		this.props.loadingStore.startLoading();

		this.saveChanges({
			passport: await this.readFiles(formData.passport),
			visa: await this.readFiles(formData.visa),
			memorandum: await this.readFiles(formData.memorandum),
			bankStatement: await this.readFiles(formData.bankStatement),
			outletInside: await this.readFiles(formData.outletInside),
			outletOutside: await this.readFiles(formData.outletOutside),
			tradeLicense: await this.readFiles(formData.tradeLicense),
			emiratesIdFile: await this.readFiles(formData.emiratesIdFile),
			powerOfAttorney: await this.readFiles(formData.powerOfAttorney),
			partnershipDeed: await this.readFiles(formData.partnershipDeed),
			shareCertificate: await this.readFiles(formData.shareCertificate)
		});
	});

	onSaveChanges = () => {
		this.saveChanges();
	};

	saveToLocalStorage = () => {
		this.props.saveFormData(this.props.userStore.getUserData().email, PAGE_NAME, {
			businessDetails: this.businessDetailsFormStore.getValues(),
			ownership: this.ownershipFormStore.getValues()
		});
	};

	restoreFromLocalStorage = () => {
		const isNotEmpty = (value) => !_.isEmpty(value);

		let {
			businessDetails,
			ownership
		} = this.props.getFormData(this.props.userStore.getUserData().email, PAGE_NAME);

		this.businessDetailsFormStore.setFormData(_.pickBy(businessDetails, isNotEmpty));
		this.ownershipFormStore.setFormData(_.pickBy(ownership, isNotEmpty));
	};

	redirectToLandingPage = () => {
		this.props.history.push('/');
		const scrollElement = document.body.scrollTop === 0 ? document.documentElement : document.body;
		scrollElement.scrollTop = 0; // immediate scroll to top
	};

	async readFiles(files) {
		if (!files.slice) return [files]; // if it's not a mobx array

		let result = [];
		for (let file of files) {
			result.push(await this.readFile(file));
		}
		return result;
	}

	async readFile(file) {
		if (!(file instanceof File)) {
			return Promise.resolve(file);
		}

		return new Promise(res => {
			let reader = new FileReader();
			reader.onloadend = () => {
				res({
					type: file.type,
					name: file.name,
					data: Array.prototype.slice.call(new Uint8Array(reader.result), 0)
				});
			};
			reader.readAsArrayBuffer(file);
		});
	}

	render() {
		const {errors} = this.props;

		const {
			welcomeText,
			applicationStatusText,
			buttons
		} = this.dictionary;

		const status = this.businessDetailsFormStore.ctrls.status.value;

		const {
			firstName
		} = this.ownershipFormStore.getValues();

		return (
			<div className="application-form-page">
				<Localization
					className="content"
					localizationDictionary={this.dictionary}>
					<div className="header-block">
						{firstName &&
						<div className="welcome-block">
							{welcomeText}, {firstName}!
						</div>
						}
						{!firstName &&
						<div className="welcome-block">
							{welcomeText}!
						</div>
						}
						<div className="application-status">
							{applicationStatusText}: {status}
						</div>
					</div>
					<div className="business-details-cnt">
						<h3 className="block-title">Business details</h3>
						<Form
							className="business-details-form"
							store={this.businessDetailsFormStore}>
							<BusinessDetails/>
						</Form>
					</div>
					<div className="ownership-block">
						<h3 className="block-title">Authorized signatory</h3>
						<Form
							className="ownership-form"
							store={this.ownershipFormStore}>
							<Ownership/>
						</Form>
						<div className="save-changes-row">
							<button
								type="button"
								className="btn btn-primary btn-submit"
								onClick={this.onSaveChanges}>
								{isNotDraft(status) ? buttons.saveChanges : buttons.saveDraftChanges}
							</button>
						</div>
					</div>
					<div className="documents-block">
						<h3 className="block-title">Documents</h3>
						<Form
							store={this.documentsFormStore}
							className="documents-upload-page">
							<Documents/>
							<ErrorSummary errors={errors}/>
						</Form>
						<div className="save-changes-row">
							<button
								type="button"
								className="btn btn-primary btn-submit"
								onClick={this.submit}>
								{buttons.submit}
							</button>
						</div>
					</div>
				</Localization>
				<ErrorSummary errors={errors}/>
			</div>
		);
	}
}
