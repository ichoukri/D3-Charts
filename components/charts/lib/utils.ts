import * as d3 from 'd3';

export const createWrapperSvg = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  width: number,
  height: number
) => {
  if (!ref.current) return;
  return d3
    .select(ref.current)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
};

export const createChartBounded = (
  wrapper: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  topPadding: number,
  leftPadding: number
) => {
  return wrapper
    .append("g")
    .style("transform", `translate(${leftPadding}px, ${topPadding}px)`);
};


export const createBottomXAxis = (
  bounded: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.AxisScale<d3.NumberValue>,
  xOfsset: number = 0,
  yOfsset: number = 0,
  ticksCount: number | undefined = undefined
) => {
  const axis = d3.axisBottom(scale);
  if (ticksCount !== undefined)
    axis.ticks(ticksCount)

  return bounded.append("g").call(axis).style("transform", `translate(${xOfsset}px, ${yOfsset}px)`);
};

export const createLeftYAxis = (
  bounded: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.AxisScale<d3.NumberValue>,
  xOfsset: number = 0,
  yOfsset: number = 0,
  ticksCount: number | undefined = undefined
) => {
  const axis = d3.axisLeft(scale);
  if (ticksCount !== undefined)
    axis.ticks(ticksCount)
  return bounded.append("g").call(axis).style("transform", `translate(${xOfsset}px, ${yOfsset}px)`);
};
