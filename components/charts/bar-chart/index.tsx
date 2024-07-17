"use client";
import React, { RefObject, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { cn } from "@/lib/utils";
import {
  createBottomXAxis,
  createChartBounded,
  createWrapperSvg,
} from "../lib/utils";

interface BarChartProps {
  className?: string;
}

export const BarChart = ({ className = "" }: BarChartProps) => {
  const [dataSet, setDataSet] = useState([]);
  const ref = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  const fetchData = async () => {
    const data: any = await d3.json("/my_weather_data.json");
    setDataSet(data);
  };

  const drawBarChart = (
    ref: RefObject<HTMLDivElement>,
    width: number,
    height: number,
    paddings: {
      top: number;
      left: number;
      right: number;
      bottom: number;
    },
    data: any[],
    xAccessor: (d: any) => any
  ) => {
    const boundsWidth = width - paddings.right - paddings.left;
    const boundsHeight = height - paddings.top - paddings.bottom;

    const svgWrapper = createWrapperSvg(ref, width, height);
    if (!svgWrapper) return;
    svgWrapper
      .append("title")
      .text("Histogram looking at the distribution of humidity in 2016");

    const bounds = createChartBounded(svgWrapper, paddings.top, paddings.left);

    const xDomain = d3.extent(data, xAccessor);
    if (xDomain.includes(undefined)) return;
    const xScale = d3
      .scaleLinear()
      .domain(xDomain as Iterable<d3.NumberValue>)
      .range([0, boundsWidth])
      .nice();

    const binsGenerator = d3
      .bin()
      .domain(xScale.domain() as any)
      .value(xAccessor)
      .thresholds(12);

    const bins = binsGenerator(data);

    const yAccessor = (d: any) => d?.length || 0;

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([boundsHeight, 0])
      .nice();

    const binsGroup = bounds.append("g");

    const binGroups = binsGroup
      .selectChildren("g")
      .data(bins)
      .enter()
      .append("g");

    const barPadding = 5;

    binGroups
      .append("rect")
      .attr("x", (d: any) => xScale(d.x0) + barPadding / 2)
      .attr("y", (d) => yScale(yAccessor(d)))
      .attr("width", (d: any) => xScale(d.x1) - xScale(d.x0) - barPadding)
      .attr("height", (d) => boundsHeight - yScale(yAccessor(d)))
      .attr("fill", "cornflowerblue");

    binGroups
      .filter(yAccessor)
      .append("text")
      .attr("x", (d: any) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", (d) => yScale(yAccessor(d)) - 5)
      .text(yAccessor || "")
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .attr("fill", "darkgrey")
      .style("font-size", "12px")
      .style("font-family", "sans-serif");

    const mean = d3.mean(dataSet, xAccessor);
    if (!mean) return;
    bounds
      .append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", boundsHeight)
      .attr("stroke", "maroon")
      .attr("stroke-dasharray", "10px 4px");

    bounds
      .append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text("Mean")
      .attr("fill", "maroon")
      .style("font-size", "12px")
      .style("text-anchor", "middle");

    const xAxis = createBottomXAxis(bounds, xScale, 0, boundsHeight);

    xAxis
      .append("text")
      .attr("x", boundsWidth / 2)
      .attr("y", paddings.bottom - 12)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Humidity");
  };

  useEffect(() => {
    if (!mountedRef.current) {
      fetchData();
      mountedRef.current = true;
      return;
    }
    if (!ref.current) return;

    if (dataSet.length !== 0) {
      const width = ref.current.clientWidth;
      const height = ref.current.clientHeight;
      const paddings = {
        top: 50,
        left: 20,
        right: 20,
        bottom: 50,
      };

      const metricAccessor = (d: any) => d["temperatureMax"];
      drawBarChart(ref, width, height, paddings, dataSet, metricAccessor);
    }
  }, [dataSet]);
  return (
    <div
      ref={ref}
      className={cn("w-[35rem] h-[35rem] bg-white shadow-lg border", className)}
    />
  );
};
