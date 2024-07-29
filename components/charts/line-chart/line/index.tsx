"use client";

import * as d3 from "d3";
import React, { useEffect, useMemo } from "react";

import { DataKey } from "../../lib/types";
import { useChart } from "../../hooks";

interface LineProps {
  dataKey?: DataKey<any>;
  stroke?: string;
}

export const Line = ({ dataKey, stroke = "#2563eb" }: LineProps) => {
  const groupRef = React.useRef<SVGGElement | null>(null);
  const { data, width, height } = useChart();

  const yAxisAccessor = useMemo(() => {
    if (!dataKey) return undefined;
    if (typeof dataKey === "function") {
      return dataKey;
    } else {
      return (d: any) => d[dataKey];
    }
  }, [dataKey]);

  const xAxisAccessor = useMemo(() => (_: any, index: number) => index, []);

  const lineGenerator = useMemo(() => {
    if (!data || !width || !height || !yAxisAccessor || !xAxisAccessor)
      return undefined;

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, xAxisAccessor) as any)
      .range([0, width])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yAxisAccessor) as any)
      .range([height, 0])
      .nice();

    return d3
      .line<any>()
      .x((d, i) => xScale(xAxisAccessor(d, i))!)
      .y((d) => yScale(yAxisAccessor(d)!)!);
  }, [data, height, yAxisAccessor, width, xAxisAccessor]);

  useEffect(() => {
    if (!groupRef.current || !lineGenerator || !data) return;

    const path = d3.select(groupRef.current).select(".line");

    path
      .datum(data)
      .attr("d", lineGenerator(data))
      .attr("stroke", stroke)
      .attr("fill", "none");
  }, [data, lineGenerator, stroke]);

  return (
    <g ref={groupRef} mask="url(#mask)">
      <path className="line" />
    </g>
  );
};
