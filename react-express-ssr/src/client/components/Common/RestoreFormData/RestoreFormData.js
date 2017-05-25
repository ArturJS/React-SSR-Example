import React, {Component} from 'react';

export default function restoreFormData(WrappedComponent) {
	return class extends Component {
		constructor(props) {
			super(props);
		}

		saveFormData = (userId, stepName, formData) => {
			if (userId) {
				localStorage.setItem(userId + stepName, JSON.stringify(formData));
			}
		};

		getFormData = (userId, stepName) => {
			let storageData = localStorage.getItem(userId + stepName);

			if (!storageData) return {};

			return JSON.parse(storageData);
		};

		removeFormData = (userId, stepName) => {
			if (userId) {
				localStorage.removeItem(userId + stepName);
			}
		};

		render() {
			return (
				<WrappedComponent
					saveFormData={this.saveFormData}
					getFormData={this.getFormData}
					removeFormData={this.removeFormData}
					{...this.props}/>
			);
		}
	};
}
