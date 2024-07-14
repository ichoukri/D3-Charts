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

interface D3LineChartProps {
  className?: string;
}

export const D3LineChart = ({ className = "" }: D3LineChartProps) => {
  const [dataSet, setDataSet] = useState([]);
  const ref = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  const fetchData = async () => {
    const data: any = await d3.json("/my_weather_data.json");
    setDataSet(data);
  };

  const drawLineChart = (
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
    xAxisAccesor: (d: any) => any,
    yAxisAccesor: (d: any) => any
  ) => {
    const svgWrapper = createWrapperSvg(ref, width, height);
    if (!svgWrapper) return;
    const bounded = createChartBounded(svgWrapper, paddings.top, paddings.left);
    const boundedWidth = width - paddings.left - paddings.right;
    const boundedHeight = height - paddings.bottom - paddings.top;

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataSet, xAxisAccesor) as any)
      .range([0, boundedWidth]);

    console.log(d3.extent(dataSet, yAxisAccesor));
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataSet, yAxisAccesor) as any)
      .range([boundedHeight, 0]);

    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAxisAccesor(d)))
      .y((d) => yScale(yAxisAccesor(d)));

    bounded
      .append("path")
      .attr("d", lineGenerator(data))
      .attr("fill", "none")
      .attr("stroke", "#ccc");

    createBottomXAxis(bounded, xScale, 0, boundedHeight);
    createLeftYAxis(bounded, yScale);
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
        top: 0,
        left: 50,
        right: 0,
        bottom: 35,
      };

      const dateParser = d3.timeParse("%Y-%m-%d");
      const xAxisAccesor = (d: any) => dateParser(d.date);
      const yAxisAccesor = (d: any) => d.temperatureMax;
      drawLineChart(
        ref,
        width,
        height,
        paddings,
        dataSet,
        xAxisAccesor,
        yAxisAccesor
      );
    }
  }, [dataSet]);

  return (
    <div
      ref={ref}
      className={cn("w-[42rem] h-[25rem]  bg-white shadow-lg", className)}
    />
  );
};
