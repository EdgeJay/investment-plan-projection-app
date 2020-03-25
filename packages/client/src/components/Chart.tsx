import React, { createRef, Component, RefObject } from 'react';
import * as d3 from 'd3';
import { ProjectionRow } from '@ipp/common';

const chartElementId = 'chart';

interface Props {
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

  componentDidMount() {
    d3.select(this.element.current)
      .style('width', '100%')
      .style('height', '100%')
      .style('background-color', '#fff')
      .style('box-shadow', '2px 2px 8px 0px rgba(115,115,115,1)');
  }

  render() {
    return <div id={chartElementId} ref={this.element}></div>;
  }
}

export default Chart;
