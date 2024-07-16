"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { cn } from "@/lib/utils";
import {
  createBottomXAxis,
  createChartBounded,
  createLeftYAxis,
  createWrapperSvg,
} from "../lib/utils";

interface ScatterplotProps {
  className?: string;
}

export const Scatterplot = ({ className = "" }: ScatterplotProps) => {
  const [dataSet, setDataSet] = useState([]);
  const ref = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  const fetchData = async () => {
    const data: any = await d3.json("/my_weather_data.json");
    setDataSet(data);
  };

  const drawScatterplot = (
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
    xAccessor: (d: any) => any,
    yAccessor: (d: any) => any,
    colorAccessor: (d: any) => any
  ) => {
    const svgWrapper = createWrapperSvg(ref, width, height);
    if (!svgWrapper) return;

    const bounds = createChartBounded(svgWrapper, paddings.top, paddings.left);

    const boundedHeight = height - paddings.bottom - paddings.top;
    const boundedWidth = height - paddings.right - paddings.left;

    const xdomain = d3.extent(data, xAccessor);
    if (xdomain.includes(undefined)) return;
    const xScale = d3
      .scaleLinear()
      .domain(xdomain as any)
      .range([0, boundedWidth])
      .nice();

    const ydomain = d3.extent(data, yAccessor);
    if (ydomain.includes(undefined)) return;
    const yScale = d3
      .scaleLinear()
      .domain(ydomain as any)
      .range([boundedHeight, 0])
      .nice();

    const colordomain = d3.extent(data, colorAccessor);
    if (ydomain.includes(undefined)) return;
    const colorScale = d3
      .scaleLinear()
      .domain(colordomain as any)
      .range(["skyblue", "darkslategrey"] as any);

    const xAxis = createBottomXAxis(bounds, xScale, 0, boundedHeight, 15);
    xAxis
      .append("text")
      .attr("x", boundedWidth / 2)
      .attr("y", paddings.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .html("Dew point (&deg;F)");

    const yAxis = createLeftYAxis(bounds, yScale, 0, 0, 3);
    yAxis
      .append("text")
      .attr("x", -boundedHeight / 2)
      .attr("y", -paddings.left + 15)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Relative humidity")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle");

    const dotsWrapper = bounds.append("g");
    const dots = dotsWrapper.selectChildren("circle").data(data);
    dots
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(colorAccessor(d)));
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
        top: 5,
        left: 50,
        right: 10,
        bottom: 45,
      };

      const xAccessor = (d: any) => d.dewPoint;
      const yAccessor = (d: any) => d.humidity;
      const colorAccessor = (d: any) => d.cloudCover;

      drawScatterplot(
        ref,
        width,
        height,
        paddings,
        dataSet,
        xAccessor,
        yAccessor,
        colorAccessor
      );
    }
  }, [dataSet]);

  return (
    <div
      ref={ref}
      className={cn(
        "w-[35rem] h-[35rem]  bg-white shadow-lg border",
        className
      )}
    />
  );
};
