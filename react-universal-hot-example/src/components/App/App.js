import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import config from '../../config';
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
      <div>
        <Helmet {...config.app.head}/>
        {this.props.children}
        <div className="well text-center">
          Have questions? Ask for help <a
          href="https://github.com/erikras/react-redux-universal-hot-example/issues"
          target="_blank">on Github</a> or in the <a
          href="https://discord.gg/0ZcbPKXt5bZZb1Ko" target="_blank">#react-universal</a> channel.
        </div>
      </div>
    );
  }
}
