import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';

@withRouter
export default class ParamsPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  render() {
    const {match} = this.props;
    const {id} = match.params;

    return (
      <div className="page params-page">
        <h1>Params page</h1>
        <div>Id param: {id}</div>
      </div>
    );
  }
}
