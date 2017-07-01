import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import serverSidePropsWrapper from '../../../helpers/serverSidePropsWrapper';
import config from '../../../../config';
import Counter from '../../common/Counter';
import {homeApi} from '../../../api/homeApi';
import './HomePage.scss';

const fetchData = () => {
  return homeApi.getPackages();
};

@serverSidePropsWrapper(fetchData)
export default class Home extends Component {
  static propTypes = {
    serverData: PropTypes.array
  };

  state = {
    serverData: []
  };

  async componentDidMount() {
    if (!this.props.serverData) {
      this.setState({serverData: await fetchData()});
    }
  }

  render() {
    let {serverData} = this.props;

    if (!serverData) {
      serverData = this.state.serverData;
    }

    return (
      <div className="page home-page">
        <Helmet title="Home"/>
        <div >
          <div className="container">
            <h1>{config.app.title}</h1>

            <h2>{config.app.description}</h2>
          </div>
        </div>
        <div className="buttons-group">
          <Counter />
          <Counter />
          <Counter />
          <Counter />
          <Counter />
        </div>

        <ul className="packages-list">
          {serverData.map(item => (
            <li key={item.id} className="package-item">
              <h5>
                {item.title}
              </h5>
              <p>
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
