import React from 'react';
import _ from 'lodash';
import {strengthSpecialSymbolsRgegex} from './../../../../constants/common';


export const inputTextCtrl = ({name, value, maxLength, placeholder, onFocus, error, onChange, onBlur, disabled, tabIndex, ctrl}) => {
	return (
		<input
			tabIndex={tabIndex}
			type="text"
			id={name}
			name={name}
			value={value}
			maxLength={maxLength}
			placeholder={placeholder}
			disabled={disabled}
			className="form-control"
			onChange={onChange}
			onBlur={onBlur}
			ref={(input) => {
				ctrl.ref = input;
			}}
			onFocus={onFocus}/>
	);
};

export const TextAreaCtrl = ({name, value, maxLength, placeholder, onFocus, error, onChange, onBlur, disabled, tabIndex, ctrl}) => {
	return (
		<textarea
			rows="4"
			tabIndex={tabIndex}
			type="text"
			id={name}
			name={name}
			value={value}
			maxLength={maxLength}
			placeholder={placeholder}
			disabled={disabled}
			className="form-control"
			onChange={onChange}
			onBlur={onBlur}
			ref={(input) => {
				ctrl.ref = input;
			}}
			onFocus={onFocus}/>
	);
};

export const inputPasswordCtrl = ({name, value, placeholder, onFocus, error, onChange, onBlur, disabled, tabIndex, ctrl}) => {
	return (
		<input
			tabIndex={tabIndex}
			type="password"
			id={name}
			name={name}
			value={value}
			disabled={disabled}
			placeholder={placeholder}
			className="form-control"
			onChange={onChange}
			onBlur={onBlur}
			ref={(input) => {
				ctrl.ref = input;
			}}
			onFocus={onFocus}/>
	);
};

export const inputNumberCtrl = ({name, value, placeholder, onFocus, error, onChange, onBlur, disabled, tabIndex, ctrl}) => {
	return (
		<input
			tabIndex={tabIndex}
			type="number"
			id={name}
			name={name}
			value={value}
			disabled={disabled}
			placeholder={placeholder}
			className="form-control"
			onChange={onChange}
			onBlur={onBlur}
			ref={(input) => {
				ctrl.ref = input;
			}}
			onFocus={onFocus}/>
	);
};

export const inputCheckboxCtrl = ({name, value, placeholder, onFocus, error, onChange, onBlur, disabled, tabIndex, ctrl}) => {
	return (
		<input
			tabIndex={tabIndex}
			type="checkbox"
			id={name}
			name={name}
			value={value}
			disabled={disabled}
			placeholder={placeholder}
			className="form-control"
			onChange={onChange}
			onBlur={onBlur}
			onFocus={onFocus}
			ref={(input) => {
				ctrl.ref = input;
			}}/>
	);
};

export const inputCheckboxWithLabelCtrl = ({name, value, placeholder, onChange, onFocus, onBlur, disabled, tabIndex, ctrl}) => {
	function onEnter(e) {
		if (e.key !== 'Enter') return;

		e.target.checked = !e.target.checked;
		onChange(e);
	}

	return (
		<div className="checkbox-with-label" tabIndex={tabIndex}>
			<label className="checkbox-cnt">
				<input
					tabIndex={tabIndex}
					type="checkbox"
					id={name}
					name={name}
					checked={value}
					disabled={disabled}
					className="form-control hide"
					onChange={onChange}
					onKeyPress={onEnter}
					onBlur={onBlur}
					ref={(input) => {
						ctrl.ref = input;
					}}
					onFocus={onFocus}/>
				<div className="checkbox">
					<div className="check-mark"/>
				</div>
			</label>
			<label htmlFor={name} className="second-business-owner-label">
				{placeholder}
			</label>
		</div>
	);
};


export const inputDateCtrl = ({name, value, placeholder, onFocus, error, onChange, onBlur, disabled, tabIndex, ctrl}) => {
	return (
		<input
			tabIndex={tabIndex}
			type="date"
			id={name}
			name={name}
			value={value}
			disabled={disabled}
			placeholder={placeholder}
			className="form-control"
			onChange={onChange}
			onBlur={onBlur}
			onFocus={onFocus}
			ref={(input) => {
				ctrl.ref = input;
			}}/>
	);
};

export const inputSelectCtrl = ({name, value, options, error, onChange, onBlur, onFocus, disabled, tabIndex, ctrl}) => {
	return (
		<select
			tabIndex={tabIndex}
			id={name}
			name={name}
			value={value}
			disabled={disabled}
			className="form-control"
			ref={(input) => {
				ctrl.ref = input;
			}}
			onChange={onChange}
			onBlur={onBlur}
			onFocus={onFocus}>
			{options && options.map(option =>
				<option
					value={option.value}
					key={option.value}>{option.name}
				</option>)
			}
		</select>
	);
};

export const inputSelectWithEmptyOptionCtrl = ({name, value, options, placeholder, error, onChange, onBlur, onFocus, disabled, tabIndex, ctrl}) => {
	return (
		<select
			tabIndex={tabIndex}
			id={name}
			name={name}
			value={value}
			disabled={disabled}
			className="form-control"
			ref={(input) => {
				ctrl.ref = input;
			}}
			onChange={onChange}
			onBlur={onBlur}
			onFocus={onFocus}>
			<option value="" defaultValue disabled>
				{placeholder}
			</option>
			{options && options.map(option =>
				<option
					value={option.value}
					key={option.value}>{option.name}
				</option>)
			}
		</select>
	);
};

export const inputSelectRadioCtrl = ({name, value, options, error, onChange, onBlur, ctrl}) => {
	function changeValue(e) {
		onChange(e.target.value);
	}

	return (
		<div>
			{options && options.map(option =>
				<div
					className="select-control"
					key={option.value}>
					<input
						className="select-item"
						value={option.value}
						type="radio"
						ref={(input) => {
							ctrl.ref = input;
						}}
						onChange={changeValue}
						checked={value === option.value || value === option.value.toString()}
						name={name}
						id={`rad_${option.name}`}/>
					<label
						className="select-label"
						htmlFor={`rad_${option.name}`}>{option.name}
					</label>
				</div>
			)}
		</div>);
};

export const inputSelectCheckboxCtrl = ({name, value, options, error, onChange, onBlur, ctrl}) => {
	function changeValue(e) {
		let arr = value;
		if (e.target.checked) {
			if (!(arr instanceof Array)) {
				arr = [];
			}
			arr.push(e.target.value);
		}
		else {
			arr.remove(e.target.value);
		}
		onChange(arr);
	}

	return (
		<div>
			{options && options.map(option =>
				<div
					className="select-control"
					key={option.value}>
					<input
						className="select-item"
						value={option.value}
						type="checkbox"
						ref={(input) => {
							ctrl.ref = input;
						}}
						checked={(value instanceof Array) && (value.find(x => x === option.value || x === option.value.toString()))}
						onChange={changeValue}
						name={name}
						id={`ch_${option.name}`}/>
					<label
						className="select-label"
						htmlFor={`ch_${option.name}`}>{option.name}
					</label>
				</div>
			)}
		</div>);
};


export const filesCtrl = ({name, value, error, onChange, onBlur, options, ctrl}) => {
	let {extensions} = options;

	function onChangeFile(e) {
		onChange([...value, ...e.target.files]);
	}

	let types = extensions ? Object.keys(extensions).join(',') : '';

	return (
		<div className="form-group chose-files-group">
			<div className="control-field without-label">
				<label className="btn btn-primary">
					Choose files
					<input
						id={name}
						name={name}
						accept={`${types}`}
						type="file"
						className="hide"
						multiple
						onChange={onChangeFile}/>
				</label>
				<small className="field-error-text form-text text-muted">{error}</small>
			</div>
		</div>
	);
};

export const prefixInputCtrl = ({name, value, maxLength, placeholder, options, onChange, onBlur, onFocus, tabIndex, ctrl}) => {
	return (
		<div className="prefix-input-item" tabIndex={tabIndex}>
			<span className="prefix-input-label">{options.prefix}</span>
			<input
				type="text"
				id={name}
				name={name}
				value={value}
				maxLength={maxLength}
				placeholder={placeholder}
				className="form-control prefix-input-field"
				ref={(input) => {
					ctrl.ref = input;
				}}
				onChange={onChange}
				onBlur={onBlur}
				onFocus={onFocus}/>
		</div>
	);
};

export const inputSelectCategoryCtrl = ({name, value, options, placeholder, error, onChange, onBlur, onFocus, disabled, ctrl}) => {
	return (
		<select
			disabled={disabled}
			id={name}
			name={name}
			value={value}
			className="form-control"
			ref={(input) => {
				ctrl.ref = input;
			}}
			onChange={onChange}
			onBlur={onBlur}
			onFocus={onFocus}>
			<option value="" defaultValue disabled>
				{placeholder}
			</option>
			{_.map(options.data, (optionValue, key) => (
				<option
					value={key}
					key={key}>{key}
				</option>
			))}
		</select>
	);
};

export const inputSelectDescriptionCtrl = ({name, value, options, placeholder, error, onChange, onFocus, onBlur, disabled, ctrl}) => {
	return (
		<select
			disabled={disabled}
			id={name}
			name={name}
			value={value}
			className="form-control"
			ref={(input) => {
				ctrl.ref = input;
			}}
			onChange={onChange}
			onBlur={onBlur}
			onFocus={onFocus}>
			<option value="" defaultValue disabled>
				{placeholder}
			</option>
			{options && _.map(options.data, (optionValue, key) => (
				<option
					value={optionValue.name}
					key={optionValue.name}>{optionValue.name}
				</option>
			))}
		</select>
	);
};

export const prefixPhoneInputCtrl = ({name, value, maxLength, placeholder, options, onChange, onFocus, onBlur, tabIndex, ctrl}) => {
	return (
		<div className="prefix-input-item" tabIndex={tabIndex}>
			<span className="prefix-input-label">{options.prefix}</span>
			<input
				type="text"
				id={name}
				name={name}
				value={value}
				maxLength={maxLength}
				placeholder={placeholder}
				className="form-control prefix-phone-input-field"
				ref={(input) => {
					ctrl.ref = input;
				}}
				onChange={onChange}
				onBlur={onBlur}
				onFocus={onFocus}/>
		</div>
	);
};


export const passwordWithBarCtrl = ({name, value, error, onChange, onBlur, options}) => {
	const passwordChange = (e) => {
		onChange(e);
	};

	const showPassword = () => {
		options.isShowPassword = true;
	};

	const hidePassword = () => {
		options.isShowPassword = false;
	};

	let strength = -2;

	if (/\d/.test(value)) {
		strength += 1;
	}

	if (/[a-z]/.test(value)) {
		strength += 1;
	}

	if (/[A-Z]/.test(value)) {
		strength += 1;
	}

	if (strengthSpecialSymbolsRgegex.test(value)) {
		strength += 1;
	}

	if (value.length >= 8) {
		strength += 1;
		if (value.length >= 15) {
			strength += 1;
		}
	}
	if (strength < 0) {
		strength = 0;
	}

	return (
		<div className="password-strength-field">
			<input
				type={options.isShowPassword ? 'text' : 'password'}
				id="PasswordInput"
				className="form-control password-strength-input"
				onChange={passwordChange}
				onBlur={onBlur}/>
			<span
				className={`fa ${options.isShowPassword ? 'fa-eye' : 'fa-eye-slash'} field-icon`}
				onMouseDown={showPassword}
				onMouseUp={hidePassword}/>
			<div className="password-strength-bar">
				<span className="fa fa-lock"/>
				<span>
					{value && options.passwordGrades[strength]}
				</span>
				<div className={`password-strength-bar-indicator password-strength-bar-indicator-${strength}`}/>
			</div>
		</div>
	);
};

export const filesDragDropCtrl = ({name, value, error, onChange, onBlur, options, children, ctrl}) => {
	let {extensions} = options;

	function onChangeFile(e) {
		if (!value || value.length === 0) {
			onChange([...e.target.files]);
		}
	}

	function onDeleteFile(e) {
		onChange([]);
	}

	function onDragOverFile(e) {
		e.stopPropagation();
		e.preventDefault();
		if (!value || value.length === 0) {
			e.currentTarget.classList.add('over');
		}
	}

	function onDropFile(e) {
		e.stopPropagation();
		e.preventDefault();
		if (!value || value.length === 0) {
			e.currentTarget.classList.remove('over');
			onChange([...value, ...e.dataTransfer.files]);
		}
	}

	function handleDragEnter(e) {
		if (!value || value.length === 0) {
			e.currentTarget.classList.add('over');
		}
	}

	function handleDragLeave(e) {
		if (!value || value.length === 0) {
			e.currentTarget.classList.remove('over');
		}
	}


	function onGuardClick(e) {
		if (value && value.length) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	let types = extensions ? Object.keys(extensions).join(',') : '';
	let icon = '';

	if (ctrl.touched) {
		if (value && value.length) {
			icon = <span className="document-icon  document-icon-success"/>;
		}
		else {
			icon = <span className="document-icon  document-icon-error"/>;
		}
	}
	else {
		icon = <span className="document-icon document-icon-upload"/>;
	}

	let body = '';

	if (ctrl.touched) {
		if (value && value.length) {
			body = (<div className="file-status">
				<h4 className="action-link" onClick={onDeleteFile}>Remove</h4>
			</div>);
		}
		else {
			body = (<div className="control-field">
				<h4 className="field-error-text form-text text-muted">{error}</h4>
				<label className="btn btn-primary">
					Try Again
					<input
						id={name}
						name={name}
						accept={`${types}`}
						type="file"
						className="hide"
						onChange={onChangeFile}/>
				</label>
			</div>);
		}
	}
	else {
		body = (<div className="control-field">
			<p>Drag and drop PNG, JPG, PDF files</p>
			<span>or</span>
			<label className="action-link action-link-near-text ">
				Select file to upload
				<input
					id={name}
					name={name}
					accept={`${types}`}
					type="file"
					className="hide"
					onChange={onChangeFile}/>
			</label>
			<small className="field-error-text form-text text-muted">{error}</small>
			<div>Maximum upload file size: 15MB.</div>
		</div>);
	}

	return (
		<label
			className={`drop-files-group ${(value && value.length) ? 'selected' : ''}`}
			onClick={onGuardClick}
			onDrop={onDropFile}
			onDragLeave={handleDragLeave}
			onDragEnter={handleDragEnter}
			onDragOver={onDragOverFile}>
			{icon}
			{
				children
			}
			{
				body
			}
		</label>
	);
};
