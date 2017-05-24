import React from 'react';
import {Redirect, Route, Switch} from 'react-router';
import {Provider} from 'mobx-react';
import 'babel-polyfill';
import './App.scss';
// Shells
import BaseShell from './components/BaseShell';
import ContentShell from './components/ContentShell';
// Pages
import LandingPage from './components/Pages/LandingPage';
import MerchantCreateAccountPage from './components/Pages/MerchantCreateAccountPage';
import ApplicationFormPage from './components/Pages/ApplicationFormPage';

// Error Pages
import NotFoundPage from './components/Pages/NotFoundPage';

// Auth check helpers
import AuthRoute from './components/Common/AuthRoute';
// Stores
import {localizationStore} from './components/Common/Localization';
import {loadingStore} from './components/Common/Loading';
import {modalStore} from './components/Common/ModalDialog';
import {userStore} from './stores';

// Routes
const Routes = (
	<BaseShell>
		<Switch>
			<Route exact path="/" component={LandingPage}/>
			<Route path="/">
				<ContentShell>
					<Switch>
						<Route path="/create-account" component={MerchantCreateAccountPage}/>
						<Route path="/404" component={NotFoundPage}/>
						<AuthRoute path="/form" component={ApplicationFormPage}/>
						<Redirect from="/*" to="/404"/>
					</Switch>
				</ContentShell>
			</Route>
		</Switch>
	</BaseShell>
);


const stores = {
	localizationStore,
	loadingStore,
	modalStore,
	userStore
};

const App = () => {
	return (
		<Provider {...stores}>
			{Routes}
		</Provider>
	);
};

export default App;
