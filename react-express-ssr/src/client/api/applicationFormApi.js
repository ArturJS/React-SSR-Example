import baseApi from './baseApi';
import {Transformers} from './../components/Common/Form';
import escapeStrToRegex from 'escape-string-regexp';
import _ from 'lodash';

export const applicationFormApi = {
	postFormData(data, emiratesPrefix, phonePrefix, mobilePhonePrefix, params) {
		return baseApi.ajax({
			method: 'put',
			url: '/merchant/account',
			data: {
				legalName: data.legalName,
				merchantName: data.merchantName,
				entityType: data.entityType,
				streetName: data.streetName,
				postOfficeBox: data.postOfficeBox,
				city: data.city,
				country: data.country,
				companyPhone: data.companyPhone && `${phonePrefix}${data.companyPhone}`.replace(/ /g, ''),
				website: data.website,
				businessSize: data.businessSize,
				businessTypeCategory: data.businessTypeCategory,
				businessTypeDescription: data.businessTypeDescription,
				businessTypeMCCID: data.businessTypeMCCID,
				countEmployees: data.countEmployees,
				countOutlets: data.countOutlets,
				contacts: [{
					firstName: data.contact.firstName,
					lastName: data.contact.lastName,
					nationality: data.contact.nationality,
					mobileNumber: data.contact.mobileNumber && `${mobilePhonePrefix}${data.contact.mobileNumber}`.replace(/ /g, ''),
					emiratesId: data.contact.emiratesId && `${emiratesPrefix}${data.contact.emiratesId}`
				}],
				documents: data.documents && {
					passport: data.documents.passport[0],
					visa: data.documents.visa[0],
					memorandum: data.documents.memorandum[0],
					bankStatement: data.documents.bankStatement[0],
					outletInside: data.documents.outletInside[0],
					outletOutside: data.documents.outletOutside[0],
					tradeLicense: data.documents.tradeLicense[0],
					emiratesIdFile: data.documents.emiratesIdFile[0],
					powerOfAttorney: data.documents.powerOfAttorney[0],
					partnershipDeed: data.documents.partnershipDeed[0],
					shareCertificate: data.documents.shareCertificate[0]
				}
			}
		}, params)
			.then(res => ({
				status: res.data.status
			}));
	},

	getFormData(emiratesPrefix, phonePrefix, mobilePhonePrefix, params) {
		const EMIRATES_PREFIX = escapeStrToRegex(emiratesPrefix);
		const PHONE_PREFIX = escapeStrToRegex(phonePrefix);
		const MOBILE_PHONE_PREFIX = escapeStrToRegex(mobilePhonePrefix);

		return baseApi.ajax({
			method: 'get',
			url: '/merchant/account'
		}, params)
			.then(res => res.data)
			.then(data => {
				return {
					businessDetails: {
						status: data.status,
						legalName: data.legalName || '',
						merchantName: data.merchantName || '',
						entityType: data.entityType || '',
						streetName: data.streetName || '',
						postOfficeBox: data.postOfficeBox || '',
						city: data.city || '',
						country: data.country || '',
						companyPhone: data.companyPhone ? data.companyPhone.replace(new RegExp(`^${PHONE_PREFIX}`), '') : '',
						website: data.website || '',
						businessSize: data.businessSize || '',
						businessTypeCategory: data.businessTypeCategory || '',
						businessTypeDescription: data.businessTypeDescription || '',
						businessTypeMCCID: data.businessTypeMCCID || '',
						countEmployees: data.countEmployees || '',
						countOutlets: data.countOutlets || ''
					},
					ownership: {
						firstName: data.contacts[0].firstName || '',
						lastName: data.contacts[0].lastName || '',
						nationality: data.contacts[0].nationality || '',
						mobileNumber: data.contacts[0].mobileNumber ? Transformers.mobilePhoneOnBlur(data.contacts[0].mobileNumber.replace(new RegExp(`^${MOBILE_PHONE_PREFIX}`), '')) : '',
						emiratesId: data.contacts[0].emiratesId ? data.contacts[0].emiratesId.replace(new RegExp(`^${EMIRATES_PREFIX}`), '') : ''
					},
					documents: data.documents && {
						passport: data.documents.passport,
						visa: data.documents.visa,
						memorandum: data.documents.memorandum,
						bankStatement: data.documents.bankStatement,
						outletInside: data.documents.outletInside,
						outletOutside: data.documents.outletOutside,
						tradeLicense: data.documents.tradeLicense,
						emiratesIdFile: data.documents.emiratesIdFile,
						powerOfAttorney: data.documents.powerOfAttorney,
						partnershipDeed: data.documents.partnershipDeed,
						shareCertificate: data.documents.shareCertificate
					}
				};
			})
			.then(data => {
				const isNotEmpty = (value) => !_.isEmpty(value);

				return {
					businessDetails: _.pickBy(data.businessDetails, isNotEmpty),
					ownership: _.pickBy(data.ownership, isNotEmpty),
					documents: _.pickBy(data.documents, isNotEmpty)
				};
			});
	}
};
