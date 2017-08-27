import React, {Component} from 'react';
import Helmet from 'react-helmet';

export default class NotFoundPage extends Component {
  render() {
    return (
      <div className="page not-found-page">
        <Helmet title="404"/>
        <h1>Doh! 404!</h1>
        <p>These are <em>not</em> the droids you are looking for!</p>
      </div>
    );
  }
}
