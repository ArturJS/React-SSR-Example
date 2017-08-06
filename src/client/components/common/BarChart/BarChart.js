import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';
import {saveDatum, restoreDatum} from '../../../helpers/d3jsHelpers';

export const initBarChart = ({svgElement, height, data}) => {
  if (__SERVER__ || !svgElement.html()) {
    svgElement
      .append('g')
      .attr('class', 'bar-chart__y-axis')
      .call(getYAxis({height, data}));

    svgElement
      .append('g')
      .attr('class', 'bar-chart__datasets')
      .attr('transform', `translate(0, ${height}) scale(1, -1)`);
  }
  else if (__CLIENT__ && svgElement.html()) {
    restoreDatum(svgElement.node());
  }

  updateBarChart({svgElement, data, height});

  if (__SERVER__) {
    saveDatum(svgElement.node());
    svgElement.attr('id', null);
  }
};

export const updateBarChart = ({svgElement, data, height}) => {
  const barChartGroup = svgElement.selectAll('.bar-chart__datasets');
  let selectionRects = barChartGroup.selectAll('g.bar-chart__rect').data(data.dataset.data);
  let enteringRects = selectionRects.enter();

  applyData({
    selection: selectionRects,
    isEntering: false,
    data,
    height
  });

  applyData(
    {
      selection: enteringRects
        .append('g')
        .attr('class', 'bar-chart__rect'),
      isEntering: true,
      data,
      height
    }
  );

  selectionRects.exit().remove();

  // update yAxis
  svgElement
    .select('.bar-chart__y-axis')
    .transition()
    .duration(1000)
    .call(getYAxis({height, data}));
};

export const applyData = ({selection, isEntering, data, height}) => {
  let rectEl = selection.select('rect');
  let textEl = selection.select('text');
  let {backgroundColor} = data.dataset;

  if (isEntering) {
    rectEl = selection.append('rect');
    textEl = selection.append('text');
  }

  if (__CLIENT__) {
    rectEl
      .attr('width', 50)
      .attr('x', (d, index) => {
        return index * 60 + 10;
      })
      .attr('fill', backgroundColor)
      .transition()
      .duration(1000)
      .attr('height', (d) => {
        return height - getHeightScale({height, data})(d);
      });

    textEl
      .attr('text-anchor', 'middle')
      .attr('x', (d, index) => {
        return index * 60 + 35;
      })
      .attr('fill', 'red')
      .attr('transform', 'scale(1, -1)')
      .transition()
      .duration(1000)
      .attr('y', (d, index) => {
        return getHeightScale({height, data})(d) - height;
      })
      .tween('text', function (d) {
        let _thisEl = d3.select(this);
        let interpolate = d3.interpolate(+_thisEl.text(), d);
        return (t) => {
          _thisEl
            .text(
              Math.round(interpolate(t))
            );
        };
      });
  }
  else {
    rectEl
      .attr('width', 50)
      .attr('x', (d, index) => {
        return index * 60 + 10;
      })
      .attr('fill', backgroundColor)
      .attr('height', (d) => {
        return height - getHeightScale({height, data})(d);
      });

    textEl
      .attr('text-anchor', 'middle')
      .attr('x', (d, index) => {
        return index * 60 + 35;
      })
      .attr('fill', 'red')
      .attr('transform', 'scale(1, -1)')
      .attr('y', (d, index) => {
        return getHeightScale({height, data})(d) - height;
      })
      .text(d => d);
  }
};

export const getYAxis = ({height, data}) => {
  return d3.axisLeft(height)
    .ticks(10)
    .scale(getHeightScale({height, data}));
};

export const getHeightScale = ({height, data}) => {
  const upperBound = getDataMax(data);

  return d3.scaleLinear()
    .domain([upperBound, 0])
    .range([0, height]);
};

export const getDataMax = _.flow([
  ({dataset}) => dataset.data,
  _.flatten,
  _.max
]);

export default class BarChart extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.shape({
      id: PropTypes.number.isRequired,
      labels: PropTypes.arrayOf(PropTypes.string),
      dataset: PropTypes.shape({
        backgroundColor: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.number)
      })
    }).isRequired
  };

  isInitialized = false;
  svgRootEl = null;
  defaultStyles = {
    overflow: 'visible'
  };


  componentWillMount() {
    let {
      height,
      data
    } = this.props;

    this.componentId = `BarChart_${data.id}`;

    if (__SERVER__) {
      global.chartsRenderQueue.barChartQueue.push(
        () => {
          let svgRootEl = d3.select(document.getElementById(this.componentId));
          initBarChart({
            svgElement: svgRootEl,
            height,
            data
          });
        }
      );
    }
    else if (__CLIENT__ && document.getElementById(this.componentId)) {
      // this.svgRootEl - necessary to avoid discarding of server side html markup by React on client side
      this.svgRootEl = d3.select(document.getElementById(this.componentId));
      initBarChart({
        svgElement: this.svgRootEl,
        height,
        data
      });
      this.isInitialized = true;
    }
  }

  componentDidMount() {
    if (!this.isInitialized) {
      let {
        height,
        data
      } = this.props;

      initBarChart({
        svgElement: this.svgElement,
        height,
        data
      });
    }

    this.svgRootEl = null;
  }

  componentDidUpdate() {
    let {
      height,
      data
    } = this.props;

    updateBarChart({
      svgElement: this.svgElement,
      height,
      data
    });
  }


  render() {
    const {
      width,
      height,
      className
    } = this.props;

    return (
      this.svgRootEl
        ?
        <svg
          id={this.componentId}
          style={this.defaultStyles}
          className={classNames('bar-chart', {[className]: !!className})}
          ref={node => this.svgElement = d3.select(node)}
          width={width}
          height={height}
          dangerouslySetInnerHTML={{__html: this.svgRootEl && this.svgRootEl.html()}}
        />
        :
        <svg
          id={this.componentId}
          style={this.defaultStyles}
          className={classNames('bar-chart', {[className]: !!className})}
          ref={node => this.svgElement = d3.select(node)}
          width={width}
          height={height}
        />
    );
  }
}
