import baseApi from './baseApi';
import _ from 'lodash';

export const dictionaryApi = {
	getNationalities() {
		return baseApi.ajax({
			method: 'get',
			url: '/dictionary/nationalities'
		})
			.then(res => res.data)
			.then(data => (data.map(item => ({
				name: item.name,
				value: item.name
			}))));
	},

	getMCCs() {
		return baseApi.ajax({
			method: 'get',
			url: '/dictionary/MCCs'
		})
			.then(res => res.data)
			.then(data => {
				return _.mapValues(data, (options) => {
					return options.map(o => ({name: o.name, value: o.id.toString()}));
				});
			});
	},

	getEntityTypes() {
		return baseApi.ajax({
			method: 'get',
			url: '/dictionary/entityTypes'
		})
			.then(res => res.data)
			.then(data => (data.map(item => ({
				name: item.name,
				value: item.name
			}))));
	},

	getEmirates() {
		return baseApi.ajax({
			method: 'get',
			url: '/dictionary/emirates'
		})
			.then(res => res.data)
			.then(data => (data.map(item => ({
				name: item.name,
				value: item.name
			}))));
	},

	getBusinessSizes() {
		return baseApi.ajax({
			method: 'get',
			url: '/dictionary/businessSizes'
		})
			.then(res => res.data)
			.then(data => (data.map(item => ({
				name: item.name,
				value: item.value
			}))));
	},

	getCurrencies() {
		return baseApi.ajax({
			method: 'get',
			url: '/dictionary/currencies'
		})
			.then(res => res.data)
			.then(data => (data.map(item => ({
				name: item.textCode,
				value: item.id.toString()
			}))));
	},

	getPackages() {
		return baseApi.ajax({
			method: 'get',
			url: '/dictionary/packages'
		})
			.then(res => res.data)
			.then(data => (data.map(item => ({
				value: item.id.toString(),
				title: item.title,
				description: item.description,
				payDescription: item.payDescription,
				pros: item.pros
			}))));
	},

	getPartnersEmails() {
		return baseApi.ajax({
			method: 'get',
			url: '/dictionary/referral-domain'
		})
			.then(res => res.data)
			.then(data => new RegExp(data.referrals.join('|')));
	},

	getCountEmployees() {
		return baseApi.ajax({
			method: 'get',
			url: '/dictionary/numberOfEmployees'
		})
			.then(res => res.data)
			.then(data => (data.map(item => ({
				name: item.name,
				value: item.id
			}))));
	}
};
