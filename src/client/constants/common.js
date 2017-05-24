// necessary to check strength of password
export const specialSymbolsString = '!@#$%&\/=?_.,:;\\-';

export const strengthSpecialSymbolsRgegex = new RegExp(`[${specialSymbolsString}]`);
export const validatePasswordRegex = new RegExp(
	// eslint-disable-next-line prefer-template
	'((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|' +
	'(?=.*[a-z])(?=.*[A-Z])(?=.*' + specialSymbolsString + ')|' +
	'(?=.*[a-z])(?=.*[0-9])(?=.*' + specialSymbolsString + ')|' +
	'(?=.*[A-Z])(?=.*[0-9])(?=.*' + specialSymbolsString + '))');

export const AE_PHONE_PREFIX = '+971';

export const AE_MOBILE_PHONE_PREFIX = '+9715';

export const EMIRATES_PREFIX = '784-';

export const fullNameRegex = /^(\s*[A-Za-z]+)+\s*$/;

export const FILE_EXTENSIONS = {
	'application/pdf': '*.pdf',
	'image/png': '*.png',
	'image/jpeg': '*.jpg'
};
