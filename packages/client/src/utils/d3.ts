import * as d3 from 'd3';

export function setupCanvasContainer(elementRef: HTMLDivElement) {
  return d3
    .select(elementRef)
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'flex')
    .style('flex-flow', 'row nowrap')
    .style('justify-content', 'center')
    .style('align-items', 'center');
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
