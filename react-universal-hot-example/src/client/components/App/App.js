import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {NavLink} from 'react-router-dom';
import config from '../../../config';
import '../../styles/base.scss';
import './App.scss';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  componentDidMount() {
    preboot.complete();
  }

  render() {
    return (
      <div className="app-shell">
        <div className="nav">
          <div className="nav-bar">
            <NavLink
              to="/"
              exact
              className="nav-link"
              activeClassName="selected">
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="nav-link"
              activeClassName="selected">
              About
            </NavLink>
            <NavLink
              to="/404"
              className="nav-link"
              activeClassName="selected">
              404
            </NavLink>
          </div>
        </div>


        <Helmet {...config.app.head}/>
        {this.props.children}
        <div className="well text-center">
          Have questions? Ask for help <a
          href="https://github.com/erikras/react-redux-universal-hot-example/issues"
          target="_blank">on Github</a> or in the <a
          href="https://discord.gg/0ZcbPKXt5bZZb1Ko" target="_blank">#react-universal</a> channel.
        </div>
      </div>
    );
  }
}
