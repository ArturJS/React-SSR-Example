import React, {Component} from 'react';
import './ErrorSummary.scss';
import PropTypes from 'prop-types';

export default class ErrorSummary extends Component {
	static propTypes = {
		errors: PropTypes.array
	};

	render() {
		const {errors} = this.props;

		return (
			<div className="error-summary">
				{errors && errors.map(error => <p key={error} className="error-item">{error}</p>)}
			</div>
		);
	}
}
