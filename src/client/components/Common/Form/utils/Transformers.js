import _ from 'lodash';
import {Validators} from '../index';
import {CONFIG} from './../../../../constants/config';

function IBAN(nextValue, prevValue) { // see also https://www.ibanvalidator.com/en/
	let ibanRegex = /^([a-zA-Z]{0,2}|([a-zA-Z]{2}\d{0,2}(\s\d{0,4}){0,4}(\s\d{0,3})?))$/;
	let value = nextValue;
	if (nextValue.length < prevValue.length && nextValue[nextValue.length - 1] === ' ') {
		value = nextValue.slice(0, nextValue.length - 1);
	}
	else if (nextValue.length > 4 && nextValue.length < 28 && (nextValue.length % 5) === 0) {
		value = `${prevValue} ${nextValue[nextValue.length - 1]}`;
	}
	if (!ibanRegex.test(value)) {
		value = prevValue;
	}
	return value;
}

function emiratesID(nextValue, prevValue) {
	let emiratesIDRegex = /^((\d{0,4})|(\d{4}-\d{0,7})|(\d{4}-\d{7}-\d))$/;
	let value = nextValue;
	if (nextValue.length < prevValue.length && nextValue[nextValue.length - 1] === '-') {
		value = nextValue.slice(0, nextValue.length - 1);
	}
	else if (nextValue.length === 5 || nextValue.length === 13) {
		value = `${prevValue}-${nextValue[nextValue.length - 1]}`;
	}
	if (!emiratesIDRegex.test(value)) {
		value = prevValue;
	}
	return value;
}

function swift(nextValue, prevValue) { // see also https://www.ibanvalidator.com/en/
	let swiftRegex = /^(([a-zA-Z]{0,4})|([a-zA-Z]{4}\s[a-zA-Z]{1,2})|([a-zA-Z]{4}\s[a-zA-Z]{2}\s[a-zA-Z0-9]{1,2})|([a-zA-Z]{4}\s[a-zA-Z]{2}\s[a-zA-Z0-9]{2}(\s[a-zA-Z0-9]{1,3})?))$/;
	let value = nextValue;

	if (nextValue.length < prevValue.length && nextValue[nextValue.length - 1] === ' ') {
		value = nextValue.slice(0, nextValue.length - 1);
	}
	else if (nextValue.length === 5 || nextValue.length === 8 || nextValue.length === 11) {
		value = `${prevValue} ${nextValue[nextValue.length - 1]}`;
	}
	if (!swiftRegex.test(value)) {
		value = prevValue;
	}
	return value;
}

function percent(nextValue, prevValue) {
	let percentRegex = /^((\d{0,2})|100)$/;
	let value = nextValue;
	if (!percentRegex.test(value)) {
		value = prevValue;
	}
	return value;
}

function float(nextValue, prevValue) {
	let floatRegex = /^((\d{0,10})|((\d{1,10})\.?(\d{0,10})))$/;
	let value = nextValue;
	if (!floatRegex.test(value)) {
		value = prevValue;
	}
	return value;
}

function percentOnBlur(value) {
	if (!value) {
		return value;
	}
	return `${value}%`;
}

function percentOnFocus(value) {
	if (!value) {
		return value;
	}
	return value.slice(0, -1);
}


const moneyFormats = {
	dollar: {
		onFocus: dollarOnFocus,
		onBlur: dollarOnBlur
	}
};

function dollarOnFocus(value) {
	return value.replace(/,/g, '');
}

function dollarOnBlur(value) {
	let index = value.indexOf('.');
	let result = '';
	let i;
	if (index > -1) {
		if (index !== value.length - 1) {
			for (i = index; i < value.length && i < index + 3; i++) {
				result += value[i];
			}
		}
		else {
			result = '.00';
		}
		index -= 1;
	}
	else {
		index = value.length - 1;
	}
	let count = 0;
	for (i = index; i >= 0; i--) {
		count++;
		result = value[i] + result;
		if (i !== 0 && count === 3) {
			result = `,${result}`;
			count = 0;
		}
	}
	return result;
}

function name() {
	return (nextValue, prevValue) => {
		if (Validators.name('')(nextValue) !== null) {
			return prevValue;
		}
		return nextValue;
	};
}

function nameOnlyLetters() {
	return (nextValue, prevValue) => {
		if (Validators.nameOnlyLetters('')(nextValue) !== null) {
			return prevValue;
		}
		return nextValue;
	};
}

function onlySymbolsByRegex(regex) {
	return (nextValue, prevValue) => {
		if (!regex.test(nextValue)) {
			return prevValue;
		}
		return nextValue;
	};
}

function numberWithLength(value) {
	return (nextValue, prevValue) => {
		if (!/^\d*$/.test(nextValue) || Validators.maxLength(value, '')(nextValue) !== null) {
			return prevValue;
		}
		return nextValue;
	};
}

function positiveNumberWithLength(value) {
	return (nextValue, prevValue) => {
		if (!/^\d*$/.test(nextValue) || Validators.maxLength(value, '')(nextValue) !== null || _.startsWith(nextValue, '0') || nextValue === '-') {
			return prevValue;
		}
		return nextValue;
	};
}

function mobilePhone(nextValue, prevValue, ctrl, isRegularPhone) {
	const phoneRegex = /^\d{0,8}$/;
	let value = nextValue;

	if (!phoneRegex.test(value)) {
		value = prevValue;
	}
	return value;
}

function phoneOnFocus(inputValue) {
	return inputValue.toString().split(' ').join('');
}

function mobilePhoneOnBlur(inputValue) {
	let value = '';
	let stringValue = inputValue.toString();
	for (let i = 0; i < stringValue.length; i++) {
		if (i === 1 || i === 4) {
			value += ` ${stringValue[i]}`;
		}
		else {
			value += stringValue[i];
		}
	}
	return value;
}


function phone(nextValue, prevValue, ctrl, isRegularPhone) {
	const phoneRegex = /^\d{0,9}$/;
	let value = nextValue;

	if (!phoneRegex.test(value)) {
		value = prevValue;
	}
	return value;
}


function phoneOnBlur(inputValue) {
	let value = '';
	let stringValue = inputValue.toString();

	for (let i = 0; i < stringValue.length; i++) {
		if ((stringValue.length === 9 && (i === 2 || i === 5)) ||
			(stringValue.length === 8 && (i === 1 || i === 4)) ||
			(stringValue.length <= 7 && i === 3)) {
			value += ` ${stringValue[i]}`;
		}
		else {
			value += stringValue[i];
		}
	}

	return value;
}

function fileTransform(nextValue, prevValue, ctrl) {
	if (!nextValue.length) {
		return nextValue;
	}
	if (ctrl.options.extensions && ctrl.options.extensions instanceof Object) {
		let result = nextValue.filter(file => ctrl.options.extensions.hasOwnProperty(file.type));

		if (nextValue.length > 0 && result.length === 0) {
			ctrl.options.formatError = true;
			return '';
		}

		const MEGABYTE = 1024 * 1024;

		let totalFilesSize = _.reduce(nextValue, (sum, file) => sum + file.size, 0) / MEGABYTE;

		if (totalFilesSize > CONFIG.maxFileSizeMB) {
			ctrl.options.sizeError = true;
			return '';
		}
		return result;
	}
	return nextValue;
}

export default {
	positiveNumberWithLength,
	numberWithLength,
	name,
	nameOnlyLetters,
	onlySymbolsByRegex,
	IBAN,
	emiratesID,
	swift,
	percent,
	percentOnFocus,
	percentOnBlur,
	float,
	moneyFormats,
	mobilePhone,
	mobilePhoneOnBlur,
	phoneOnFocus,
	phone,
	phoneOnBlur,
	fileTransform
};
