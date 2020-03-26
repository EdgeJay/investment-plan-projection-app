import * as d3 from 'd3';
import { date as dateUtils, ProjectionRow } from '@ipp/common';

export function setupCanvasContainer({
  elementRef,
  width,
  height,
}: {
  elementRef: HTMLDivElement;
  width: number;
  height: number;
}) {
  return d3
    .select(elementRef)
    .style('width', `${width}px`)
    .style('height', `${height}px`)
    .style('position', 'relative');
}

export function setupCanvas({
  container,
  width,
  height,
}: {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  width: number;
  height: number;
}) {
  return container
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('width', `${width}px`)
    .style('height', `${height}px`)
    .style('background-color', '#fff')
    .style('box-shadow', '2px 2px 8px 0px rgba(115,115,115,1)');
}

export function addLine<DS>({
  canvas,
  dataSet,
  line,
  strokeColour,
  strokeWidth = 1,
}: {
  canvas: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  dataSet: DS[];
  line: d3.Line<DS>;
  strokeColour: string;
  strokeWidth?: number;
}): d3.Selection<SVGPathElement, DS[], null, undefined> {
  return canvas
    .append('path')
    .datum(dataSet)
    .attr('fill', 'none')
    .attr('stroke', strokeColour)
    .attr('stroke-width', strokeWidth)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', line);
}

export enum LineType {
  TOP_25,
  MEDIAN,
  BOTTOM_10,
  BENCHMARK,
  TOTAL_DEPOSIT,
}

export function getValueForLineType(lineType: LineType, row: ProjectionRow): number {
  switch (lineType) {
    case LineType.TOP_25:
      return row.expectedAmounts['75'];
    case LineType.MEDIAN:
      return row.expectedAmounts['50'];
    case LineType.BOTTOM_10:
      return row.expectedAmounts['10'];
    case LineType.BENCHMARK:
      return row.expectedAmounts.benchmark;
    case LineType.TOTAL_DEPOSIT:
      return row.totalDeposit;
    default:
      return 0;
  }
}

export function addDotsToLine({
  canvas,
  dataSet,
  xTicks,
  yTicks,
  toolTipOffset,
}: {
  canvas: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  dataSet: ProjectionRow[];
  xTicks: d3.ScaleTime<number, number>;
  yTicks: d3.ScaleLinear<number, number>;
  toolTipOffset: { x: number; y: number };
}) {
  canvas
    .selectAll('.dot')
    .data(dataSet)
    .enter()
    .append('g')
    .attr('class', 'dots')
    .attr('id', row => `dots_${row.sequence}`)
    .attr('transform', row => `translate(${xTicks(dateUtils.convertToDate(row.yearMonth))}, 0)`)
    .attr('opacity', 0)
    .on('mouseover', (row, idx, groups) => {
      const toolTipXPos = xTicks(dateUtils.convertToDate(row.yearMonth)) - 200 - toolTipOffset.x;
      const toolTipYPos =
        yTicks(getValueForLineType(LineType.TOTAL_DEPOSIT, row)) - 200 - toolTipOffset.y;
      d3.select(groups[idx]).attr('opacity', 1);
      d3.select('#info')
        .style('display', 'block')
        .style('transform', `translate(${toolTipXPos}px, ${toolTipYPos}px)`);
    })
    .on('mouseout', (d, idx, groups) => {
      d3.select(groups[idx]).attr('opacity', 0);
      d3.select('#info').style('display', 'none');
    });

  dataSet.forEach(data => {
    // dot for top 25
    canvas
      .select(`#dots_${data.sequence}`)
      .append('circle')
      .attr('fill', 'red')
      .attr('stroke-width', 0)
      .attr('cx', 0)
      .attr('cy', yTicks(getValueForLineType(LineType.TOP_25, data)))
      .attr('r', 4);
    // dot for median
    canvas
      .select(`#dots_${data.sequence}`)
      .append('circle')
      .attr('fill', 'red')
      .attr('stroke-width', 0)
      .attr('cx', 0)
      .attr('cy', yTicks(getValueForLineType(LineType.MEDIAN, data)))
      .attr('r', 4);
    // dot for bottom 10
    canvas
      .select(`#dots_${data.sequence}`)
      .append('circle')
      .attr('fill', 'red')
      .attr('stroke-width', 0)
      .attr('cx', 0)
      .attr('cy', yTicks(getValueForLineType(LineType.BOTTOM_10, data)))
      .attr('r', 4);
    // dot for benchmark
    canvas
      .select(`#dots_${data.sequence}`)
      .append('circle')
      .attr('fill', 'red')
      .attr('stroke-width', 0)
      .attr('cx', 0)
      .attr('cy', yTicks(getValueForLineType(LineType.BENCHMARK, data)))
      .attr('r', 4);
    // dot for total deposit
    canvas
      .select(`#dots_${data.sequence}`)
      .append('circle')
      .attr('fill', 'red')
      .attr('stroke-width', 0)
      .attr('cx', 0)
      .attr('cy', yTicks(getValueForLineType(LineType.TOTAL_DEPOSIT, data)))
      .attr('r', 4);
  });

  canvas
    .selectAll('.dots')
    .exit()
    .remove();
}

export function addToolTip({
  container,
}: {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
}) {
  // Add div as tooltip
  container
    .append('div')
    .attr('id', 'info')
    .style('width', '200px')
    .style('height', '200px')
    .style('border', '1px solid black')
    .style('background-color', 'white')
    .style('box-shadow', '2px 2px 8px 0px rgba(115,115,115,1)')
    .style('position', 'absolute')
    .style('top', 0)
    .style('left', 0)
    .style('display', 'none');
}
