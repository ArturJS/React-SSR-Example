import React, {Component} from 'react';
import classNames from 'classnames';

import './ErrorBoundary.scss';


export default function errorBoundary(WrappedComponent) {
  return class ErrorBoundary extends Component {
    state = {
      hasError: false,
      error: null,
      info: null
    };

    componentDidCatch(error, info) {
      this.setState({
        hasError: true,
        error: JSON.stringify(error),
        info: JSON.stringify(info)
      });
    }

    render() {
      if (this.state.hasError) {
        const {
          error,
          info
        } = this.state;

        return (
          <div className={classNames('error-boundary', this.props.className)}>
            <div>Something went wrong here...</div>
            <div>Error: "{error}"</div>
            <div>Additional info: "{info}"</div>
          </div>
        );
      }

      return <WrappedComponent {...this.props}/>;
    }
  };
}