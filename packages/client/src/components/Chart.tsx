import React, { createRef, Component, RefObject } from 'react';
import * as d3 from 'd3';
import { date as dateUtils, numbers, ProjectionRow } from '@ipp/common';

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

  getInvestmentValues(dataSet?: ProjectionRow[]): number[] {
    const values: number[] = [];

    if (dataSet && dataSet.length > 0) {
      dataSet.forEach(data => {
        values.push(data.totalDeposit);
        values.push(data.expectedAmounts['10']);
        values.push(data.expectedAmounts['50']);
        values.push(data.expectedAmounts['75']);
        values.push(data.expectedAmounts.benchmark);
      });
    }

    return values;
  }

  drawAxes(dataSet?: ProjectionRow[]) {
    if (!dataSet) {
      return;
    }

    const investmentValues = this.getInvestmentValues(dataSet);
    const { width, height } = this.getCanvasSize();

    const box = d3.select(this.element.current);

    // find out min max for time range
    let dateMinMax = d3.extent<ProjectionRow, Date>(dataSet, row =>
      dateUtils.convertToDate(row.yearMonth)
    );
    dateMinMax = [dateMinMax[0] || new Date(), dateMinMax[1] || new Date()];

    // Functions for drawing X axis (time)
    const xTicks = d3
      .scaleUtc()
      .domain(dateMinMax)
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

    // find out min max for investment numbers
    let investMinMax = d3.extent<number, number>(investmentValues, val => val);
    investMinMax = [investMinMax[0] || 0, investMinMax[1] || 0];

    // Functions for drawing Y axis (investment)
    const yTicks = d3
      .scaleLinear()
      .domain(investMinMax)
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
