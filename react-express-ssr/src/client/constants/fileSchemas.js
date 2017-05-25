export const BASE = {
	passport: {
		hide: false,
		required: true
	},
	visa: {
		hide: true,
		required: false
	},
	memorandum: {
		hide: true,
		required: false
	},
	emiratesIdFile: {
		hide: true,
		required: false
	},
	powerOfAttorney: {
		hide: true,
		required: false
	},
	partnershipDeed: {
		hide: true,
		required: false
	},
	shareCertificate: {
		hide: true,
		required: false
	},
	bankStatement: {
		hide: false,
		required: true
	},
	outletInside: {
		hide: false,
		required: true
	},
	outletOutside: {
		hide: false,
		required: true
	},
	tradeLicense: {
		hide: false,
		required: true
	}
};


export const LLC = {
	passport: {
		hide: false,
		required: true
	},
	visa: {
		hide: false,
		required: false
	},
	memorandum: {
		hide: false,
		required: false
	},
	emiratesIdFile: {
		hide: false,
		required: true
	},
	powerOfAttorney: {
		hide: true,
		required: false
	},
	partnershipDeed: {
		hide: true,
		required: false
	},
	shareCertificate: {
		hide: true,
		required: false
	},
	bankStatement: {
		hide: false,
		required: true
	},
	outletInside: {
		hide: false,
		required: true
	},
	outletOutside: {
		hide: false,
		required: true
	},
	tradeLicense: {
		hide: false,
		required: true
	}
};


export const SOLE_PROPRIETOR = {
	passport: {
		hide: false,
		required: true
	},
	visa: {
		hide: false,
		required: false
	},
	memorandum: {
		hide: true,
		required: false
	},
	emiratesIdFile: {
		hide: false,
		required: true
	},
	powerOfAttorney: {
		hide: false,
		required: true
	},
	partnershipDeed: {
		hide: true,
		required: false
	},
	shareCertificate: {
		hide: true,
		required: false
	},
	bankStatement: {
		hide: false,
		required: true
	},
	outletInside: {
		hide: false,
		required: true
	},
	outletOutside: {
		hide: false,
		required: true
	},
	tradeLicense: {
		hide: false,
		required: true
	}
};


export const PARTNERSHIP = {
	passport: {
		hide: false,
		required: true
	},
	visa: {
		hide: false,
		required: false
	},
	memorandum: {
		hide: true,
		required: false
	},
	emiratesIdFile: {
		hide: false,
		required: true
	},
	powerOfAttorney: {
		hide: true,
		required: false
	},
	partnershipDeed: {
		hide: false,
		required: true
	},
	shareCertificate: {
		hide: true,
		required: false
	},
	bankStatement: {
		hide: false,
		required: true
	},
	outletInside: {
		hide: false,
		required: true
	},
	outletOutside: {
		hide: false,
		required: true
	},
	tradeLicense: {
		hide: false,
		required: true
	}
};

export const FREE_ZONE = {
	passport: {
		hide: false,
		required: true
	},
	visa: {
		hide: false,
		required: false
	},
	memorandum: {
		hide: true,
		required: false
	},
	emiratesIdFile: {
		hide: false,
		required: true
	},
	powerOfAttorney: {
		hide: true,
		required: false
	},
	partnershipDeed: {
		hide: true,
		required: false
	},
	shareCertificate: {
		hide: false,
		required: true
	},
	bankStatement: {
		hide: false,
		required: true
	},
	outletInside: {
		hide: false,
		required: true
	},
	outletOutside: {
		hide: false,
		required: true
	},
	tradeLicense: {
		hide: false,
		required: true
	}
};

export const EMIRIAN = {
	emiratesIdFile: {
		hide: false,
		required: true
	},
	visa: {
		hide: true,
		required: false
	}
};


export const NON_EMIRIAN = {
	emiratesIdFile: {
		hide: true,
		required: false
	},
	visa: {
		hide: false,
		required: true
	}
};


export const SCHEMAS_DIC = {
	LLC,
	'Free Zone': FREE_ZONE,
	'Partnership': PARTNERSHIP,
	'Sole Proprietor': SOLE_PROPRIETOR
};
