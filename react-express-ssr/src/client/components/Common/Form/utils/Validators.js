import _ from 'lodash';

export default {
	required,
	minLength,
	regex,
	maxLength,
	rangeLength,
	minValue,
	number,
	float,
	bool,
	string,
	date,
	maxFilesSizeMB,
// specific
	emiratesID,
	mobilePhoneValidator,
	IBAN,
	swift,
	money,
	website,
	name,
	nameOnlyLetters,
	phoneValidator,
	email,
	formatValidator,
	sizeValidator
};

function required(error) {
	function _required(value, values) {
		if (_.isEmpty(value) || _.isString(value) && _.isEmpty(value.trim())) {
			return error;
		}
		return null;
	}

	_required.isRequiredFunction = true;

	return _required;
}

function minLength(length, error) {
	return (value, values) => {
		if (value.length < length && value.length > 0) {
			return error;
		}
		return null;
	};
}

function maxLength(length, error) {
	return (value, values) => {
		if (value.length > length && value.length > 0) {
			return error;
		}
		return null;
	};
}

function rangeLength(minLen, maxLen, error) {
	return (value, values) => {
		if ((value.length < minLength || value.length > maxLength) && value.length > 0) {
			return error;
		}
		return null;
	};
}

function minValue(minVal, error) {
	return (value, values) => {
		if (value < minVal) {
			return error;
		}
		return null;
	};
}

function number(error) {
	const numberRegexp = new RegExp(
		'^' +                // No leading content.
		'[-+]?' +            // Optional sign.
		'([0]|[1-9]' +       // No leading zeros.
		'([0-9]{0,30}))' +   // Maximum 31 digits
		'$'                  // No trailing content.
	);
	return regex(numberRegexp, error);
}

function float(error) {
	const numberRegexp = new RegExp(
		'^' +                // No leading content.
		'[-+]?' +            // Optional sign.
		'([0]|[1-9]' +       // No leading zeros.
		'([0-9]{0,30}))' +   // Maximum 31 digits
		'(.[0-9]{1,30})?' +   // Optional fraction
		'$'                  // No trailing content.
	);
	return regex(numberRegexp, error);
}


function bool(error) {
	return (value, values) => {
		if ((typeof value !== 'boolean' || value !== 'true' || value !== 'false') && value.length > 0) {
			return error;
		}
		return null;
	};
}


function string(error) {
	return (value, values) => {
		if (typeof value !== 'string' && value.length > 0) {
			return error;
		}
		return null;
	};
}

function date(error) {
	// eslint-disable-next-line max-len
	const numberRegexp = /^(((((((0?[13578])|(1[02]))[\.\-/]?((0?[1-9])|([12]\d)|(3[01])))|(((0?[469])|(11))[\.\-/]?((0?[1-9])|([12]\d)|(30)))|((0?2)[\.\-/]?((0?[1-9])|(1\d)|(2[0-8]))))[\.\-/]?(((19)|(20))?([\d][\d]))))|((0?2)[\.\-/]?(29)[\.\-/]?(((19)|(20))?(([02468][048])|([13579][26])))))$/;
	// Matches 02-29-2004 | 1/31/1997 | 1-2-03
	// Non-Matches 02-29-2003 | 04-31-2003 | 31-03-05
	return regex(numberRegexp, error);
}

function maxFilesSizeMB(maxSizeMB, error) {
	const MEGABYTE = 1024 * 1024;

	return (value) => {
		let totalFilesSize = _.reduce(value, (sum, file) => sum + file.size, 0) / MEGABYTE;

		if (totalFilesSize > maxSizeMB) {
			return error;
		}
		return null;
	};
}

function regex(reg, error) {
	return (value, values) => {
		if (!reg.test(value) && value.length > 0) {
			return error;
		}
		return null;
	};
}

// specific
function IBAN(error) {
	const numberRegexp = /^([a-zA-Z]{2}\d{2}(\s\d{4}){4})(\s\d{3})$/;
	return regex(numberRegexp, error);
}

function money(error) {
	const moneyRegexp = /^[0-9]{1,3}((,[0-9]{3})*)?(.[0-9]{1,2})?$/;
	return regex(moneyRegexp, error);
}

function emiratesID(error) {
	const numberRegexp = /^\d{4}-\d{7}-\d$/;
	return regex(numberRegexp, error);
}

function swift(error) {
	const numberRegexp = /^[a-zA-Z]{4}\s[a-zA-Z]{2}\s[a-zA-Z0-9]{2}(\s[a-zA-Z0-9]{3})?$/;
	return regex(numberRegexp, error);
}

function website(error) {
	const numberRegexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
	return regex(numberRegexp, error);
}

function name(error) {
	const numberRegexp = /^[a-zA-Z0-9&]+([&., -]*[&a-zA-Z0-9]*)*$/;
	return regex(numberRegexp, error);
}

function nameOnlyLetters(error) {
	const numberRegexp = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
	return regex(numberRegexp, error);
}

function mobilePhoneValidator(error) {
	const phoneRegexp = /^\d{8}|^\d \d{3} \d{4}$/;
	return regex(phoneRegexp, error);
}

function email(error) {
	return regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, error);
}

function phoneValidator(error) {
	const phoneRegexp = /^\d{6,9}$|^(\d{1,2} )?\d{3} \d{3,4}$|^\d{3} \d{2} \d{3,4}$|^\d{3} \d{6}$|^\d{3} \d{3} \d{3}$/;
	return regex(phoneRegexp, error);
}

function sizeValidator(error) {
	return (value, values, ctrl) => {
		if (ctrl.options && ctrl.options.sizeError) {
			ctrl.options.sizeError = false;
			return error;
		}
		return null;
	};
}

function formatValidator(error) {
	return (value, values, ctrl) => {
		if (ctrl.options && ctrl.options.formatError) {
			ctrl.options.formatError = false;
			return error;
		}
		return null;
	};
}
