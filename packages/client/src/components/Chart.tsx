import React, { createRef, Component, RefObject } from 'react';
import * as d3 from 'd3';
import { numbers, ProjectionRow } from '@ipp/common';

const chartElementId = 'chart';
const defaultCanvasWidth = 500;
const defaultCanvasHeight = 500;
const margin = {
  top: 16,
  right: 70,
  bottom: 20,
  left: 16,
};

interface Props {
  width?: number;
  height?: number;
  dataSet?: ProjectionRow[];
}

class Chart extends Component<Props> {
  private _element: RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this._element = createRef<HTMLDivElement>();
  }

  get element(): RefObject<HTMLDivElement> {
    return this._element;
  }

  getCanvasSize(): { width: number; height: number } {
    const { width, height } = this.props;
    return {
      width: width || defaultCanvasWidth,
      height: height || defaultCanvasWidth,
    };
  }

  getInvestRange(dataSet?: ProjectionRow[]): { min: number; max: number } {
    const result = { min: 0, max: 0 };
    let values: number[] = [];

    if (dataSet && dataSet.length > 0) {
      dataSet.forEach(data => {
        values.push(data.totalDeposit);
        values.push(data.expectedAmounts['10']);
        values.push(data.expectedAmounts['50']);
        values.push(data.expectedAmounts['75']);
        values.push(data.expectedAmounts.benchmark);
      });

      values = values.sort((a, b) => a - b);

      return {
        min: values[0],
        max: values[values.length - 1],
      };
    }

    return result;
  }

  getDateRange(dataSet?: ProjectionRow[]): { min: Date; max: Date } {
    const result = { min: new Date(), max: new Date() };
    let values: Date[] = [];

    if (dataSet && dataSet.length > 0) {
      dataSet.forEach(data => {
        const parts = data.yearMonth.split('-');
        const date = new Date(numbers.convertToInt(parts[0]), numbers.convertToInt(parts[1]) - 1);
        values.push(date);
      });

      values = values.sort((a, b) => a.getTime() - b.getTime());

      return {
        min: values[0],
        max: values[values.length - 1],
      };
    }

    return result;
  }

  drawAxes(dataSet?: ProjectionRow[]) {
    const { min: valueMin, max: valueMax } = this.getInvestRange(dataSet);
    const { min: dateMin, max: dateMax } = this.getDateRange(dataSet);
    const { width, height } = this.getCanvasSize();

    const box = d3.select(this.element.current);

    // Functions for drawing X axis (time)
    const xTicks = d3
      .scaleTime()
      .domain([dateMin, dateMax])
      .range([margin.left, width - margin.right]);

    const drawXAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g.attr('transform', `translate(0, ${height - margin.bottom})`).call(
        d3
          .axisBottom(xTicks)
          .ticks(d3.timeYear.every(3))
          .tickFormat(x => {
            const date = x as Date;
            return `${date.getUTCFullYear()}`;
          })
      );

    // Functions for drawing Y axis (investment)
    const yTicks = d3
      .scaleLinear()
      .domain([valueMin, valueMax])
      .range([height - margin.bottom, margin.top]);

    const drawYAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g
        .attr('transform', `translate(${width - margin.right}, 0)`)
        .call(d3.axisRight(yTicks).tickFormat(y => `$${d3.format('.1f')((y as number) / 1e6)}m`));

    const canvas = box
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', `${width || defaultCanvasWidth}px`)
      .style('height', `${height || defaultCanvasHeight}px`)
      .style('background-color', '#fff')
      .style('box-shadow', '2px 2px 8px 0px rgba(115,115,115,1)');

    canvas.append('g').call(drawXAxis);
    canvas.append('g').call(drawYAxis);
  }

  componentDidMount() {
    d3.select(this.element.current)
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('flex-flow', 'row nowrap')
      .style('justify-content', 'center')
      .style('align-items', 'center');
  }

  componentDidUpdate() {
    const { dataSet } = this.props;
    this.drawAxes(dataSet);
  }

  render() {
    return <div id={chartElementId} ref={this.element}></div>;
  }
}

export default Chart;
