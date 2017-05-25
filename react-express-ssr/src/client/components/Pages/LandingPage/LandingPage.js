import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import {versionApi} from '../../../api/versionApi';
import './LandingPage.scss';

@inject('localizationStore', 'modalStore')
@observer
export default class LandingPage extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired
	};

	state = {
		appVersion: null
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('LandingPage');
	}

	componentDidMount() {
		versionApi.getOnboardingAppVersion()
			.then(appVersion => {
				this.setState({
					appVersion: `Build ${appVersion}`
				});
			});
	}

	showLoginModal = (e) => {
		e.preventDefault();
		this.props.history.push('/?login-modal');
	};

	render() {
		const {
			appVersion
		} = this.state;

		const reasonsChoose = this.dictionary.reasonChoose
			.map(reason => <li
				className="promo-panel-item"
				key={reason}>{reason}</li>);

		return (
			<div className="landing ">
				<div className="landing-bg">
					<div className="landing-header">
						<div className="logo">
							<div className="logo-sizer"/>
						</div>
					</div>
					<div className="landing-jumbotron">
						<h1 className="landing-title">{this.dictionary.title}</h1>
						<ul className="promo-panel">
							{reasonsChoose}
						</ul>
						<div className="start-panel">
							<h3 className="start-panel-title">{this.dictionary.canJoin}</h3>
							<p>{this.dictionary.reasonJoin}</p>
							<Link
								to="/create-account"
								className="unstyled-link btn btn-primary">{this.dictionary.join}</Link>
							<p className="sign-section">
								<span>{this.dictionary.isAccountExist}</span>
								<a className="link" onClick={this.showLoginModal}>{this.dictionary.sign}</a>
							</p>
						</div>
					</div>
				</div>
				<div className="landing-footer">
					<h3 className="sub-title">{this.dictionary.partners}</h3>
					<ul className="brands">
						<li className="brands-item">
							<div className="brands-item-img enbd-logo">
								<div className="brands-item-img-sizer"/>
							</div>
						</li>
						<li className="brands-item">
							<div className="brands-item-img adcb-logo">
								<div className="brands-item-img-sizer"/>
							</div>
						</li>
						<li className="brands-item">
							<div className="brands-item-img  oman-arabbank-logo">
								<div className="brands-item-img-sizer"/>
							</div>
						</li>
						<li className="brands-item">
							<div className="brands-item-img emirates-islamic-logo">
								<div className="brands-item-img-sizer"/>
							</div>
						</li>
						<li className="brands-item">
							<div className="brands-item-img rakbak-logo">
								<div className="brands-item-img-sizer"/>
							</div>
						</li>
					</ul>
				</div>
				<div className="phone-links">
					<p className="sub-title">{this.dictionary.downloadText}</p>
					<div>
						<a className="btn-app-store"/>
						<a className="btn-google-play"/>
					</div>
				</div>
				<div className="app-version">
					{appVersion}
				</div>
			</div>
		);
	}
}
