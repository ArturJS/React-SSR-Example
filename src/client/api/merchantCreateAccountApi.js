import baseApi from './baseApi';
import {userStore} from '../stores';

export const merchantCreateAccountApi = {
	postFormData(formData, params, phonePrefix) {
		return baseApi.ajax({
			method: 'post',
			url: '/merchant/account',
			data: {
				companyName: formData.company,
				name: formData.name,
				email: formData.email,
				phoneNumber: formData.phone && `${phonePrefix}${formData.phone}`.replace(/ /g, ''),
				captcha: {
					text: formData.captchaText
				}
			}
		}, params)
			.then(res => res.data)
			.then(data => {
				userStore.setUserData({
					email: formData.email,
					company: formData.company,
					fullName: formData.name,
					phone: formData.phone,
					authToken: `${data.token_type} ${data.access_token}`,
					expiresIn: data.expires_in
				});

				return data.identityId;
			});
	}
};
