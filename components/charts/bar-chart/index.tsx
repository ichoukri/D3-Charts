"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { cn } from "@/lib/utils";

interface BarChartProps {
  className?: string;
  data: any[];
  title?: string;
  paddings?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  xAxisTitle?: string;
}

export const BarChart = ({
  className = "",
  data,
  title = "",
  paddings = {},
  xAxisTitle = "",
}: BarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const mountedRef = useRef(false);
  const boundsWidthRef = useRef<number>(0);
  const boundsHeightRef = useRef<number>(0);
  const boundsRef =
    useRef<d3.Selection<SVGGElement, unknown, null, undefined>>();

  const [ready, setReady] = React.useState(false);

  const {
    top: topPadding = 50,
    left: leftPadding = 20,
    right: rightPadding = 20,
    bottom: bottomPadding = 50,
  } = paddings;

  const drawHistogram = (
    xAxisTitle: string,
    data: number[],
    barPadding: number = 10
  ) => {
    if (!boundsRef.current) return;

    const height = boundsHeightRef.current;
    const width = boundsWidthRef.current;

    const xdomain = d3.extent(data);
    if (xdomain[0] === undefined && xdomain[1] === undefined) return;

    const xScale = d3.scaleLinear().domain(xdomain).range([0, width]).nice();

    const binsGenerator = d3.bin().domain(xScale.domain() as any);
    const bins = binsGenerator(data);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d: any) => d.length)])
      .range([height, 0])
      .nice();

    const exitTransition = d3.transition().duration(600);
    const updateTransition = exitTransition.transition().duration(600);

    // Bind the data to the bins
    let binGroups: d3.Selection<any, any, any, any> = boundsRef.current
      .select(".bins")
      .selectAll(".bin")
      .data(bins);

    // Handle exit selection
    const oldBinGroups = binGroups.exit();

    oldBinGroups
      .selectAll("rect")
      .style("fill", "red")
      .transition(exitTransition)
      .attr("y", height)
      .attr("height", 0);

    oldBinGroups.selectAll("text").transition(exitTransition).attr("y", height);

    oldBinGroups.transition(exitTransition).remove();

    const newBinGroups = binGroups.enter().append("g").attr("class", "bin");

    newBinGroups
      .append("rect")
      .attr("height", 0)
      .attr("x", (d) => xScale(d.x0) + barPadding / 2)
      .attr("y", height)
      .attr(
        "width",
        (d: any) => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]) as any
      )
      .style("fill", "yellowgreen");

    newBinGroups
      .append("text")
      .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", height);

    binGroups = newBinGroups.merge(binGroups);

    const barRects = binGroups.select("rect");

    barRects
      .transition(updateTransition)
      .attr("x", (d: any) => xScale(d.x0) + barPadding / 2)
      .attr("y", (d: any) => yScale(d.length))
      .attr("height", (d: any) => height - yScale(d.length))
      .attr(
        "width",
        (d: any) => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]) as any
      )
      .transition()
      .style("fill", "cornflowerblue");

    binGroups
      .select("text")
      .transition(updateTransition)
      .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", (d: any) => yScale(d.length) - 5)
      .text((d: any) => d.length || "");

    boundsRef.current
      .select(".x-axis")
      .transition(updateTransition)
      .call(d3.axisBottom(xScale) as any);

    if (xAxisTitle)
      boundsRef.current
        .select(".x-axis-label")
        .transition(updateTransition)
        .text(xAxisTitle);
  };

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    boundsWidthRef.current = width - leftPadding - rightPadding;
    boundsHeightRef.current = height - topPadding - bottomPadding;

    boundsRef.current = d3.select(svgRef.current).select(".bounds");

    boundsRef.current.append("g").attr("class", "bins");

    const xAxis = boundsRef.current
      .append("g")
      .attr("class", "x-axis")
      .style("transform", `translateY(${boundsHeightRef.current}px)`);

    if (xAxisTitle) {
      xAxis
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", boundsWidthRef.current / 2)
        .attr("y", bottomPadding - 10);
    }

    setReady(true);

    return () => {
      // Cleanup function to remove all appended elements
      if (boundsRef.current) {
        boundsRef.current.selectAll("*").remove();
        boundsRef.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    drawHistogram(xAxisTitle || "", data);
  }, [data, ready]);

  return (
    <div
      className={cn("w-[35rem] h-[35rem] bg-white shadow-lg border", className)}
    >
      <svg width="100%" height="100%" ref={svgRef}>
        {title && <title>{title}</title>}
        <g
          className="bounds"
          style={{
            transform: `translate(${leftPadding}px, ${topPadding}px)`,
          }}
        />
      </svg>
    </div>
  );
};
