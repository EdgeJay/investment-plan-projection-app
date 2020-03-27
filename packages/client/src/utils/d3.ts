import * as d3 from 'd3';
import { date as dateUtils, ProjectionRow } from '@ipp/common';

const toolTipSize = {
  width: 200,
  height: 200,
};

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

export function destroyCanvas({
  container,
}: {
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
}) {
  container.select('svg').remove();
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
      const toolTipXPos =
        xTicks(dateUtils.convertToDate(row.yearMonth)) - toolTipSize.width - toolTipOffset.x;
      const toolTipYPos =
        yTicks(getValueForLineType(LineType.TOTAL_DEPOSIT, row)) -
        toolTipSize.height -
        toolTipOffset.y;

      // show dots
      d3.select(groups[idx]).attr('opacity', 1);

      updateToolTip({
        dataSet: row,
        left: toolTipXPos,
        top: toolTipYPos,
        show: true,
      });
    })
    .on('mouseout', (d, idx, groups) => {
      // hide dots
      d3.select(groups[idx]).attr('opacity', 0);
      // hide tooltip
      updateToolTip({ show: false });
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
  const div = container
    .append('div')
    .attr('id', 'info')
    .style('width', `${toolTipSize.width}px`)
    .style('height', `${toolTipSize.height}px`)
    .style('border', '1px solid black')
    .style('background-color', 'white')
    .style('box-shadow', '2px 2px 8px 0px rgba(115,115,115,1)')
    .style('font-size', '0.625rem')
    .style('padding', '0.5rem')
    .style('position', 'absolute')
    .style('top', 0)
    .style('left', 0)
    .style('display', 'none');

  div
    .append('p')
    .style('font-size', '0.75rem')
    .attr('id', 'displayedDate');

  div
    .append('p')
    .attr('id', 'top25Txt')
    .style('color', 'steelblue')
    .style('margin-top', 0);
  div
    .append('p')
    .attr('id', 'medianTxt')
    .style('color', 'darkgreen')
    .style('margin-top', 0);
  div
    .append('p')
    .attr('id', 'bottom10Txt')
    .style('color', 'red')
    .style('margin-top', 0);
  div
    .append('p')
    .attr('id', 'benchmarkTxt')
    .style('margin-top', 0);
  div
    .append('p')
    .attr('id', 'totalDepositTxt')
    .style('color', 'darkblue')
    .style('margin-top', 0);
}

export function updateToolTip({
  dataSet,
  top = 0,
  left = 0,
  show = false,
}: {
  dataSet?: ProjectionRow;
  top?: number;
  left?: number;
  show?: boolean;
}) {
  // update content
  if (dataSet) {
    const moneyFormatter = (value: number) => `$${d3.format(',')(value)}`;
    const date = dateUtils.convertToDate(dataSet.yearMonth);
    d3.select('p#displayedDate').text(`${dateUtils.convertToDateString(date)}`);
    d3.select('p#top25Txt').text(
      `Top 25%: > ${moneyFormatter(getValueForLineType(LineType.TOP_25, dataSet))}`
    );
    d3.select('p#medianTxt').text(
      `Median: ${moneyFormatter(getValueForLineType(LineType.MEDIAN, dataSet))}`
    );
    d3.select('p#bottom10Txt').text(
      `Bottom 10%: < ${moneyFormatter(getValueForLineType(LineType.BOTTOM_10, dataSet))}`
    );
    d3.select('p#benchmarkTxt').text(
      `Benchmark: ${moneyFormatter(getValueForLineType(LineType.BENCHMARK, dataSet))}`
    );
    d3.select('p#totalDepositTxt').text(
      `Total Deposit: ${moneyFormatter(getValueForLineType(LineType.TOTAL_DEPOSIT, dataSet))}`
    );
  }

  d3.select('#info')
    .style('display', show ? 'block' : 'none')
    .style('transform', `translate(${left}px, ${top}px)`);
}
