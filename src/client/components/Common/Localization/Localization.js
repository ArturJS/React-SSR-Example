import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';

@observer
export default class Localization extends Component {
	static propTypes = {
		localizationDictionary: PropTypes.object.isRequired,
		children: PropTypes.any.isRequired,
		pageName: PropTypes.string,
		className: PropTypes.string
	};

	static childContextTypes = {
		localizationDictionary: PropTypes.object
	};

	getChildContext() {
		return {
			localizationDictionary: this.props.localizationDictionary
		};
	}

	render() {
		let {children, className} = this.props;

		return (
			<div className={className}>
				{children}
			</div>
		);
	}
}
