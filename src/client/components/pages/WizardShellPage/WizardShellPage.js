import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class WizardShellPage extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    const {children} = this.props;
    return (
      <div className="page wizard-shell-page">
        <h1>Wow! I can't believe! I'm wizard shell!</h1>
        <div className="wizard-page-wrapper">
          {children}
        </div>
      </div>
    );
  }
}
