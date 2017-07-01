import React, {Component} from 'react';

export default function serverSidePropsWrapper(fetchData) {
  return (WrappedComponent) => {
    return class extends Component {
      static fetchData = fetchData;

      componentWillMount() {
        if (__CLIENT__) {
          this.serverData = window.__INITIAL_PAGE_PROPS__;
          window.__INITIAL_PAGE_PROPS__ = null;
        }
      }

      render() {
        return (
          <WrappedComponent
            serverData={this.serverData}
            {...this.props}/>
        );
      }
    };
  };
}
