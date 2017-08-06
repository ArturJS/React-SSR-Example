import React, {Component} from 'react';
import Helmet from 'react-helmet';
import _ from 'lodash';
import BarChart from '../../common/BarChart';
import './ChartsPage.scss';

export default class ChartsPage extends Component {
  state = {
    barChartData: {
      id: 1,
      labels: ['A', 'B', 'C', 'D', 'E'],
      dataset: {
        backgroundColor: '#546E7A',
        data: [10, 50, 150, 20, 30]
      }
    },
    isInterval: true
  };

  componentDidMount() {
    this.initUpdateInterval();
  }

  componentWillUnmount() {
    this.terminateUpdateInterval();
  }

  terminateUpdateInterval() {
    clearInterval(this.updateInterval);
  };

  initUpdateInterval() {
    this.updateInterval = setInterval(() => {
      this.setState(() => {
        let dataLength = _.random(3, 6);
        let data = _.times(dataLength, () => _.random(15, 655));
        let firstCharCode = 'A'.charCodeAt();
        let labels = _.times(dataLength, (index) => String.fromCharCode(firstCharCode + index));

        return {
          barChartData: {
            id: 1,
            labels,
            dataset: {
              backgroundColor: '#546E7A',
              data
            }
          }
        };
      })
    }, 3000);
  }

  toggleUpdate = () => {
    if (this.state.isInterval) {
      this.terminateUpdateInterval();
    }
    else {
      this.initUpdateInterval();
    }

    this.setState(({isInterval}) => ({
      isInterval: !isInterval
    }));
  };

  render() {
    const {barChartData, isInterval} = this.state;

    return (
      <div className="page charts-page">
        <Helmet title="Server side rendered charts"/>
        <h1>Server side rendered charts</h1>
        <div>
          <button
            type="button"
            className="btn btn-default"
            onClick={this.toggleUpdate}>
            {`${isInterval ? 'Pause' : 'Resume'} bar chart animation`}
          </button>
        </div>
        <div className="demo-panel">
          <BarChart width={300} height={500} data={barChartData}/>
        </div>
      </div>
    );
  }
}
