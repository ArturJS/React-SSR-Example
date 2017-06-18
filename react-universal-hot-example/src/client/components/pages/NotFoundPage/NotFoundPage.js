import React, {Component} from 'react';

export default class NotFoundPage extends Component {
  render() {
    return (
      <div className="page not-found-page">
        <h1>Doh! 404!</h1>
        <p>These are <em>not</em> the droids you are looking for!</p>
      </div>
    );
  }
}
