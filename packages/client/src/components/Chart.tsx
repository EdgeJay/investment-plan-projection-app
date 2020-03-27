import React, { createRef, Component, RefObject } from 'react';
import * as d3 from 'd3';
import { date as dateUtils, ProjectionRow } from '@ipp/common';
import {
  addLine,
  addDotsToLine,
  addToolTip,
  getValueForLineType,
  LineType,
  setupCanvasContainer,
  setupCanvas,
  destroyCanvas,
} from '../utils/d3';

const chartElementId = 'chart';
const defaultCanvasWidth = 500;
const defaultCanvasHeight = 500;
const margin = {
  top: 16,
  right: 70,
  bottom: 20,
  left: 16,
};
const toolTipOffset = {
  x: 16,
  y: 16,
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
      height: height || defaultCanvasHeight,
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

  draw(dataSet?: ProjectionRow[]) {
    if (!dataSet || !this.element.current) {
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

    // destroy previous instances of SVG
    destroyCanvas({ container: box });

    // create new SVG canvas
    const canvas = setupCanvas({
      container: box,
      width,
      height,
    });

    canvas.append('g').call(drawXAxis);
    canvas.append('g').call(drawYAxis);

    // setup line functions
    const top25Line = d3
      .line<ProjectionRow>()
      .defined(row => dateUtils.isDefined(row.yearMonth))
      .x(row => xTicks(dateUtils.convertToDate(row.yearMonth)))
      .y(row => yTicks(getValueForLineType(LineType.TOP_25, row)));

    const medianLine = d3
      .line<ProjectionRow>()
      .defined(row => dateUtils.isDefined(row.yearMonth))
      .x(row => xTicks(dateUtils.convertToDate(row.yearMonth)))
      .y(row => yTicks(getValueForLineType(LineType.MEDIAN, row)));

    const bottom10Line = d3
      .line<ProjectionRow>()
      .defined(row => dateUtils.isDefined(row.yearMonth))
      .x(row => xTicks(dateUtils.convertToDate(row.yearMonth)))
      .y(row => yTicks(getValueForLineType(LineType.BOTTOM_10, row)));

    const benchmarkLine = d3
      .line<ProjectionRow>()
      .defined(row => dateUtils.isDefined(row.yearMonth))
      .x(row => xTicks(dateUtils.convertToDate(row.yearMonth)))
      .y(row => yTicks(getValueForLineType(LineType.BENCHMARK, row)));

    const totalDepositLine = d3
      .line<ProjectionRow>()
      .defined(row => dateUtils.isDefined(row.yearMonth))
      .x(row => xTicks(dateUtils.convertToDate(row.yearMonth)))
      .y(row => yTicks(getValueForLineType(LineType.TOTAL_DEPOSIT, row)));

    // add lines to chart
    addLine({ canvas, dataSet, line: top25Line, strokeColour: 'steelblue' });
    addLine({ canvas, dataSet, line: medianLine, strokeColour: 'darkgreen' });
    addLine({ canvas, dataSet, line: bottom10Line, strokeColour: 'red' });
    addLine({ canvas, dataSet, line: benchmarkLine, strokeColour: 'black', strokeWidth: 1.5 });
    addLine({
      canvas,
      dataSet,
      line: totalDepositLine,
      strokeColour: 'darkblue',
      strokeWidth: 1.5,
    }).attr('stroke-dasharray', '10, 5');

    // add dots to lines
    addDotsToLine({
      canvas,
      dataSet,
      xTicks,
      yTicks,
      toolTipOffset,
    });

    // Add div as tooltip
    addToolTip({ container: box });
  }

  componentDidMount() {
    if (this.element.current) {
      const { width, height } = this.getCanvasSize();
      setupCanvasContainer({ elementRef: this.element.current, width, height });
      this.draw(this.props.dataSet);
    }
  }

  componentDidUpdate() {
    const { dataSet } = this.props;
    this.draw(dataSet);
  }

  render() {
    return <div id={chartElementId} ref={this.element}></div>;
  }
}

export default Chart;
