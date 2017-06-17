import React, {Component} from 'react';
import PropTypes from 'prop-types';
import config from '../../../config';
import Helmet from 'react-helmet';
import Counter from '../Counter';
import {homeApi} from '../../api/homeApi';
import './Home.scss';

export default class Home extends Component {
  static propTypes = {
    data: PropTypes.array
  };

  state = {
    data: []
  };

  async componentDidMount() {
    if (!this.props.data) {
      this.setState({data: await Home.fetchData()});
    }
  }

  static fetchData = () => {
    return homeApi.getPackages();
  };

  render() {
    let {data} = this.props;
    console.log('props data', data);

    if (!data) {
      data = this.state.data;
    }

    return (
      <div className="home-page">
        <Helmet title="Home"/>
        <div >
          <div className="container">
            <h1>{config.app.title}</h1>

            <h2>{config.app.description}</h2>
          </div>
        </div>
        <div>
          <Counter />
          <Counter />
          <Counter />
          <Counter />
          <Counter />
        </div>

        <ul className="packages-list">
          {data.map(item => (
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
