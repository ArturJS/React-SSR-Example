import React from 'react';
import {render} from 'react-dom';
import './client/polyfills';
import 'font-awesome/scss/font-awesome.scss';

import App from './App';

render(<App />, document.getElementById('root'));
