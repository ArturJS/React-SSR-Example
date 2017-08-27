import React, {Component} from 'react';
import Helmet from 'react-helmet';

export default class Page1 extends Component {
  render() {
    return (
      <div className="page">
        <Helmet title="Wizard Page1"/>
        <h2>First wizard page. Nothing particularly fancy...</h2>
      </div>
    );
  }
}
