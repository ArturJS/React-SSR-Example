const ApplicationFormPage = {
	welcomeText: 'Welcome to Network International',
	applicationStatusText: 'Application Status',
	applicationStatusByDefault: 'Draft',

	places: 'Company name / Location',
	streetName: 'Address',
	postOfficeBox: 'P.O. Box',
	city: 'City',
	country: 'Country',
	companyPhone: 'Company phone',
	website: 'Website',
	legalName: 'Legal name',
	entityType: 'Business entity type',
	merchantName: 'Trading as',
	merchantNameCheckbox: 'Trading name differs from Legal/trade name',
	businessSize: 'Annual turnover, AED',
	businessTypeCategory: 'Business nature',
	businessTypeDescription: 'Business line',
	countEmployees: 'Number of employees',
	countOutlets: 'Number of outlets',


	firstName: 'First name',
	lastName: 'Last name',
	nationality: 'Nationality',
	emiratesId: 'Emirates ID',
	mobileNumber: 'Mobile number',


	passport: 'Passport of authorized signatory',
	passportSubTitle: '(page with issue/expiry date)',
	visa: 'Visa of authorized signatory',
	memorandum: 'Memorandum of association',
	bankStatement: 'Bank statement with IBAN member',
	outletInside: 'Picture of outlet',
	outletInsideSubTitle: '(inside)',
	outletOutside: 'Picture of outlet',
	outletOutsideSubTitle: '(outside)',
	tradeLicense: 'Trade license',
	emiratesIdFile: 'Emirates ID of the authorized signatory',
	powerOfAttorney: 'Power of attorney',
	partnershipDeed: 'Partnership deed',
	shareCertificate: 'Share certificate',
	notice: 'Allowed formats PNG, JPG, PDF. Maximum file size - 15MB',
	fileSizeError: 'The file is too large. Maximum upload file size: 15 MB. Try again.',
	formatError: 'File format not recognised. Please upload only PNG, JPG or PDF files. Try again.',

	placeholders: {
		places: 'Company name or location',
		businessTypeCategory: 'Please select...',
		businessTypeDescription: 'Please select...',
		nationality: 'Please select...',
		city: 'Please select...',
		entityType: 'Please select...',
		merchantName: 'Trading as',
		legalName: 'Legal (trade) name',
		country: 'Country',
		postOfficeBox: 'P.O. Box',
		streetName: 'Address',
		companyPhone: 'X XXX XXXX',
		mobileNumber: 'X XXX XXXX',
		website: 'company.com',
		countEmployees: '0',
		primaryLocations: 'Primary locations and trade areas',
		countOutlets: '0',
		firstName: 'First name',
		lastName: 'Last name',
		emiratesId: 'XXXX-XXXXXXX-X'
	},
	validators: {
		streetName: {
			required: 'Please enter address',
			regex: 'Valid characters are A-Z a-z 0-9 . , -'
		},
		postOfficeBox: {
			required: 'Please enter P.O. box',
			number: 'Post office box can contains numbers only',
			maxLength: 'Post office box max length is 10 digits'
		},
		city: {
			required: 'Please select city'
		},
		country: {
			required: 'Country is required'
		},
		companyPhone: {
			required: 'Please enter Company phone',
			invalid: 'Please, provide phone number in correct format'
		},
		website: {
			invalid: 'Valid characters are a-z 0-9 . -'
		},
		legalName: {
			required: 'Please enter legal (trade) name',
			name: 'Valid characters are A-Z a-z 0-9 . , -'
		},
		entityType: {
			required: 'Please select business entity type'
		},
		merchantName: {
			required: '"Trading as" is required',
			name: 'Valid characters are A-Z a-z 0-9 . , -'
		},
		businessSize: {
			required: 'Please select annual turnover'
		},
		businessTypeCategory: {
			required: 'Please select business nature'
		},
		businessTypeDescription: {
			required: 'Please select business line'
		},
		countEmployees: {
			required: 'Please select number of employees',
			minValue: 'Number of employees must be non negative value'
		},
		countOutlets: {
			required: 'Please enter the number of outlets',
			minValue: 'The number of stores can not be less than 1'
		},


		firstName: {
			required: 'Please enter authorized signatory first name',
			regex: 'Valid characters are A-Z a-z'
		},
		lastName: {
			required: 'Please enter authorized signatory last name',
			regex: 'Valid characters are A-Z a-z'
		},
		nationality: {
			required: 'Please select Nationality'
		},
		emiratesId: {
			required: 'Please enter Emirates ID',
			emiratesID: 'Please enter emirates ID in the correct format'
		},
		mobileNumber: {
			required: 'Please enter mobile phone number',
			invalid: 'Please enter phone number in the international format: 971 5x xxxxxxx'
		},
		percentageOfOwnership: {
			required: 'Please enter Percentage Of Ownership'
		},

		// documents
		passport: {
			required: 'Please upload Passport'
		},
		visa: {
			required: 'Visa file is required'
		},
		memorandum: {
			required: 'Please upload Memorandum of association'
		},
		bankStatement: {
			required: 'Please upload Bank statement with IBAN'
		},
		outletInside: {
			required: 'Please upload Picture of outlet (inside)'
		},
		outletOutside: {
			required: 'Please upload Picture of outlet (outside)'
		},
		tradeLicense: {
			required: 'Please upload Trade License'
		},
		emiratesIdFile: {
			required: 'Please upload Emirates ID'
		},
		powerOfAttorney: {
			required: 'Please upload Power of attorney'
		},
		partnershipDeed: {
			required: 'Please upload Partnership deed'
		},
		shareCertificate: {
			required: 'Please upload Share certificate'
		}
	},

	buttons: {
		saveDraftChanges: 'Submit application',
		saveChanges: 'Save changes',
		submit: 'Send for approval'
	}
};

export default ApplicationFormPage;
