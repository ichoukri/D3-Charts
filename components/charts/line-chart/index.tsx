"use client";

import React, { useEffect } from "react";
import { useChart } from "../hooks";
import * as d3 from "d3";
import { DataKey } from "../lib/types";

interface LineChartProps {
  className?: string;
  children?: React.ReactElement<unknown, React.JSXElementConstructor<any>>[];
  data: any[];
}

const LinearScale = ({
  data,
  width,
  height,
  dataKey,
}: {
  data: any[];
  width: number;
  height: number;
  dataKey: DataKey<any>;
}) => {
  if (!data || !width || !height) return null;

  if (typeof dataKey === "function") {
    return d3
      .scaleLinear()
      .domain(d3.extent(data, dataKey) as any)
      .range([height, 0]);
  }

  return d3
    .scaleLinear()
    .domain(d3.extent(data, (d: any) => d[dataKey]) as any)
    .range([height, 0]);
};

export const LineChart = ({
  className = "",
  children,
  data,
}: LineChartProps) => {
  const { height, width, setData,  } = useChart();
  const maskRef = React.useRef<SVGRectElement | null>(null);

  useEffect(() => {
    // setData
    setData(data);

    // draw mask
    d3.select(maskRef.current)
      .attr("width", 0)
      .attr("height", height ?? 0)
      .attr("fill", "white")
      .transition()
      .duration(3000)
      .ease(d3.easeLinear)
      .attr("width", width ?? 0);

    // calculate bounds width and height
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const name = child.type.name;
        if (name === "Xaxis") {
          
        }
      }
    });
  }, [data, height, width, setData, children]);

  if (!height || !width) {
    return null;
  }
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <svg
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <mask id="mask">
          <rect ref={maskRef} />
        </mask>
        {children}
      </svg>
    </div>
  );
};
