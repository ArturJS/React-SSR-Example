const MerchantCreateAccountPage = {
	title: 'Start taking payments... ',
	subtitle: 'We only need to know a few details to get you started',
	email: 'Email',
	company: 'Legal name',
	name: 'Authorized signatory',
	phone: 'Mobile phone number',
	agreementsInfo: `By continuing, I agree to Network International’s 
					<a class="text-primary" href="/terms-and-conditions">Terms & Conditions</a> and 
					<a class="text-primary" href="/privacy-policy">Privacy Policy</a>`,
	placeholders: {
		email: 'name@mycompany.com',
		company: 'Legal (trade) name',
		name: 'Authorized signatory name',
		phone: '0 000 0000'
	},
	validators: {
		email: {
			required: 'Please enter your email',
			minLength: 'Please enter email in the correct format.',
			wrongDots: 'Please enter email in the correct format.',
			regex: 'Valid characters are A-Z a-z 0-9 ! # $ % & \' * + - / = ? ^ _ ` { | } ~ .'
		},
		company: {
			required: 'Please enter your company name',
			name: 'Valid characters are A-Z a-z 0-9 . , -'
		},
		name: {
			required: 'Please enter your full name',
			regex: 'Valid characters are A-Z a-z'
		},
		phone: {
			required: 'Please enter your mobile phone number',
			invalid: 'Please, provide phone number in correct format'
		}
	},
	buttons: {
		continue: 'Sign Up'
	}
};

export default MerchantCreateAccountPage;
