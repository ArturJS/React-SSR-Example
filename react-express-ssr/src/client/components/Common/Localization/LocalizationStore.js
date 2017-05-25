import * as Pages from './Pages';

class LocalizationStore {
	dictionary = {
		...Pages,
		AppReceivedModal: {
			descriptions: [
				'You submitted the application.',
				'The only step is left - documents uploading.'
			],
			descriptionsWithDocuments: [
				'Your application is received.',
				'You will be notified via email upon the consideration of your application.'
			],
			buttons: {
				ok: 'OK'
			}
		},
		ResendConfirmLinkModal: {
			loginModalTitle: 'Sign In',
			alreadyInUseText: 'This email address already in use. To access your application:',
			descriptions: [
				'If you already have the account, please,',
				'If you don\'t have credentials yet, please follow the link in your email.'
			],
			resendText: 'If you didn\'t receive your verification email, please search the spam folder or resend confirmation link.',
			buttons: {
				signIn: 'sign in',
				resend: 'Resend confirmation link'
			}
		},
		UnableToGoBackModal: {
			loginModalTitle: 'Sign In',
			alreadySubmittedText: 'You have already submitted the application.',
			signInText: 'You\'ll be able to make changes to your application after',
			buttons: {
				signIn: 'sign in',
				ok: 'OK'
			}
		},
		NewMerchantModal: {
			merchantName: 'Merchant Name',
			merchantSales: 'Merchant Expected Sales Per Year, AED',
			businessTypeCategory: 'Business Type Category',
			businessTypeSubCategory: 'Business Type Subcategory',
			emirate: 'Emirate',
			fullAddress: 'Full Address',
			contactName: 'Contact Name',
			contactFirstName: 'Contact First Name',
			contactLastName: 'Contact Last Name',
			contactNumber: 'Contact Number',
			productReferred: 'Product Referred',
			placeholders: {
				merchantSales: 'Sales Per Year',
				contactNumber: 'X XXX XXXX'
			},
			validators: {
				merchantName: {
					required: '"Merchant Name" is required'
				},
				merchantSales: {
					required: '"Merchant Expected Sales Per Year" is required'
				},
				businessTypeCategory: {
					required: '"Business Type Category" is required'
				},
				businessTypeSubCategory: {
					required: '"Business Type Subcategory" is required'
				},
				emirate: {
					required: '"Emirate" is required'
				},
				fullAddress: {
					required: '"Full Address" is required'
				},
				contactFirstName: {
					required: '"Contact First Name" is required',
					regex: '"Contact First Name" must contain only a-z A-Z symbols'
				},
				contactLastName: {
					required: '"Contact Last Name" is required',
					regex: '"Contact Last Name" must contain only a-z A-Z symbols'
				},
				contactNumber: {
					required: '"Contact Number" is required',
					invalid: '"Contact Number" must is phone format'
				},
				productReferred: {
					required: '"Product Referred" is required'
				}
			},
			buttons: {
				submit: 'Submit'
			}
		},
		Footer: {
			copyright: '\u00A9 Copyright 2017 Network International. All rights reserved',
			policy: 'Privacy policy'
		},
		IssueModal: {
			title: "We'll be back soon!",
			reason: ['Our website is temporarily down for maintenance', 'We will be back online shortly'],
			thanks: 'Thanks you for you patience'
		},
		LoginModal: {
			login: 'Email',
			register: 'Register today',
			isAccountExist: "Don't have an account?",
			isPassword: 'Forgotten password?',
			password: 'Password',
			registrationModalTitle: 'Sign Up',
			validators: {
				login: {
					required: 'Email is required'
				},
				password: {
					required: 'Password is required'
				}
			},
			loginButton: {
				label: 'Sign In'
			}
		},
		RegistrationModal: {
			login: 'Email',
			password: 'Password',
			validators: {
				login: {
					required: 'Email is required'
				},
				password: {
					required: 'Password is required'
				}
			},
			loginButton: {
				label: 'Sign Up'
			}
		},
		UnfinishedAppModal: {
			email: 'Email',
			loginText: `You already started application using this email.
						To continue your unfinished application, please`,
			sendEmailText: `You already started application using this email.
							You have to sign in to access your unfinished application.
							Please follow the link in your email to create password.
							In case if you haven't received the email we can resend it.`,
			skipAppText: 'To skip previous application and start the new one press "Skip and Continue".',
			loginModalTitle: 'Sign in',
			buttons: {
				login: 'sign in.',
				skipApp: 'Skip And Continue',
				send: 'Send'
			},
			placeholders: {
				email: 'yourname@yourdomain.com'
			},
			validators: {
				email: {
					required: 'Email is required',
					regex: 'Invalid email format'
				}
			}
		},
		UserAuthState: {
			loginModalTitle: 'Sign In',
			buttons: {
				login: 'Sign In',
				logout: 'Sign Out'
			}
		}
	};

	getPage = (name) => {
		return this.dictionary[name];
	};
}

export default new LocalizationStore();
