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
        <Helmet {...config.app.head}/>
        <div className="nav">
          <div className="nav-bar">
            <NavLink
              to="/"
              exact
              className="nav-link"
              activeClassName="selected"
              tabIndex="0">
              Home
            </NavLink>
            <NavLink
              to="/charts"
              exact
              className="nav-link"
              activeClassName="selected"
              tabIndex="0">
              Charts
            </NavLink>
            <div
              className="nav-dropdown"
              tabIndex="0">
              <div className="nav-dropdown-title">
                Wizard
              </div>
              <div className="nav-dropdown-menu">
                <NavLink
                  to="/wizard/page1"
                  exact
                  className="nav-link"
                  activeClassName="selected">
                  Page1
                </NavLink>
                <NavLink
                  to="/wizard/page2"
                  exact
                  className="nav-link"
                  activeClassName="selected">
                  Page2
                </NavLink>
              </div>
            </div>
            <NavLink
              to="/params/123"
              className="nav-link"
              activeClassName="selected"
              tabIndex="0">
              Params
            </NavLink>
            <NavLink
              to="/about"
              className="nav-link"
              activeClassName="selected"
              tabIndex="0">
              About
            </NavLink>
            <NavLink
              to="/404"
              className="nav-link"
              activeClassName="selected"
              tabIndex="0">
              404
            </NavLink>
          </div>
        </div>
        <div className="page-container">
          {this.props.children}
        </div>
        <div className="footer">
          Have questions? Ask for help
          &nbsp;
          <a
            rel="noopener"
            href="https://github.com/ArturJS/React-SSR-MiniQ/issues"
            target="_blank">
            on Github
          </a>.
        </div>
      </div>
    );
  }
}
