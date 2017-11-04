import React, {Component} from 'react';

import errorBoundary from '../ErrorBoudary';
import './ErrorDemo.scss';

@errorBoundary
export default class ErrorDemo extends Component {
  state = {
    hasError: false
  };

  throwError = () => {
    this.setState({
      hasError: true
    });
  };

  render() {
    if (this.state.hasError) {
      const data = {};
      console.log(data.data.data);
    }

    return (
      <div className="error-demo">
        <button
          type="button"
          className="btn btn-default"
          onClick={this.throwError}>
          Throw an error
        </button>
      </div>
    );
  }
}