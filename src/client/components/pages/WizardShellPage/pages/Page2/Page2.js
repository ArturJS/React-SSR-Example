import React, {Component} from 'react';
import Helmet from 'react-helmet';

export default class Page2 extends Component {
  render() {
    return (
      <div className="page">
        <Helmet title="Wizard Page2"/>
        <h2>Second wizard page. Nothing very interesting...</h2>
      </div>
    );
  }
}
