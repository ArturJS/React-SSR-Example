import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CONFIG} from './../../../constants/config';
import _ from 'lodash';

export default class Recaptcha extends Component {
	static propTypes = {
		verifyCallback: PropTypes.func,
		expiredCallback: PropTypes.func,
		className: PropTypes.string
	};

	componentDidMount() {
		if (window.grecaptcha) {
			window.recapthcaId = this.initRecaptcha();
		} // document ready state check
		else if (document.readyState === 'complete' || document.readyState !== 'loading') {
			this.domReady();
		}
		else {
			document.addEventListener('DOMContentLoaded', this.domReady);
		}
	}

	setupFakeRecaptcha = () => {
		window.grecaptcha = {
			render: (name, config) => {
				window.grecaptcha.callback = config.callback;
				console.log('fake recapthcaId');
				return 0; // it's fake recapthcaId
			},
			reset: _.noop,
			execute: () => {
				window.grecaptcha.callback(null);
			}
		};
	};

	domReady = () => {
		window.recapthcaId = this.initRecaptcha();
	};

	initRecaptcha = () => {
		if (!window.grecaptcha) {
			this.setupFakeRecaptcha();
		}

		return window.grecaptcha.render('Recaptcha', {
			sitekey: CONFIG.captchaKey,
			callback: (this.props.verifyCallback) ? this.props.verifyCallback : undefined,
			'expired-callback': (this.props.expiredCallback) ? this.props.expiredCallback : () => {
				window.grecaptcha.reset(window.recapthcaId);
			},
			'size': 'invisible'
		});
	};

	render() {
		const {className} = this.props;

		return (
			<div id="Recaptcha" className={className}/>
		);
	}
}
