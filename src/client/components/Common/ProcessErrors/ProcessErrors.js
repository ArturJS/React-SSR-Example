import React, {Component} from 'react';
import _ from 'lodash';

export default function processErrors(WrappedComponent) {
	return class extends Component {
		state = {
			errors: null
		};

		constructor(props) {
			super(props);
		}

		setErrors = (errors) => {
			this.setState({errors});
		};

		processAjaxError = (error) => {
			let errorStatus = _.get(error, 'response.status');

			if (errorStatus === 400) {
				this.setState({
					errors: error.response.data.errors
				});
			}
		};

		render() {
			return (
				<WrappedComponent
					errors={this.state.errors}
					setErrors={this.setErrors}
					processAjaxError={this.processAjaxError}
					{...this.props}/>
			);
		}
	};
}
