import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './client/polyfills';
import 'font-awesome/scss/font-awesome.scss';

import App from './app';

render((<BrowserRouter>
	<App/>
</BrowserRouter>), document.getElementById('root'));
