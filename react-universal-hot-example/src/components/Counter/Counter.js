import React, {Component} from 'react';

export default class Counter extends Component {

  state = {
    count: 0
  };

  plusOne = () => {
    this.setState({
      count: this.state.count + 1
    });
  };

  render() {
    return (
      <button type="button" onClick={this.plusOne}>
        Count: {this.state.count}
      </button>
    );
  }
}
