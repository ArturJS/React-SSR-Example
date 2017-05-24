import baseApi from './baseApi';

export const versionApi = {
	getOnboardingAppVersion() {
		return baseApi.ajax({
			method: 'get',
			url: '/onboarding/info'
		})
			.then(res => res.data.build.version);
	},

	getReferralAppVersion() {
		return baseApi.ajax({
			method: 'get',
			url: '/referral/version'
		})
			.then(res => res.data.buildNumber);
	}
};
