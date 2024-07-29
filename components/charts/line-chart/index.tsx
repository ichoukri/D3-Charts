"use client";

import React, { useEffect } from "react";
import { useChart } from "../hooks";
import * as d3 from "d3";

interface LineChartProps {
  className?: string;
  children?: React.ReactNode;
  data?: any[];
}

export const LineChart = ({
  className = "",
  children = null,
  data = [],
}: LineChartProps) => {
  const { height, width, setData } = useChart();
  const maskRef = React.useRef<SVGRectElement | null>(null);

  useEffect(() => {
    setData(data);
    d3.select(maskRef.current)
      .attr("width", 0)
      .attr("height", height ?? 0)
      .attr("fill", "white")
      .transition()
      .duration(3000)
      .ease(d3.easeLinear)
      .attr("width", width ?? 0);
  }, [data, height, width, setData]);

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
