"use client";
import { cn } from "@/lib/utils";
import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

type Tdata = {
  technology: string;
  count: number;
};

interface BarChartProps {
  data: Tdata[];
  className?: string;
}

const BarChart = ({ data, className = "" }: BarChartProps) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef<Boolean>(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const updateSizes = () => {
      const bounds = wrapperRef.current?.getBoundingClientRect();
      setWidth(bounds?.width ?? 0);
      setHeight(bounds?.height ?? 0);
    };
    const observer = new ResizeObserver(updateSizes);
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      if (wrapperRef.current) {
        observer.unobserve(wrapperRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "w-full max-w-4xl h-full svg-container aspect-video",
        className
      )}
      ref={wrapperRef}
    >
      <svg className="w-full h-full bg-slate-200"></svg>
    </div>
  );
};

const Page = () => {
  const [data, setData] = useState<Tdata[]>([]);

  useEffect(() => {
    d3.csv("data.csv").then((data) => {
      const sortedData = data
        .map((d) => ({ technology: d.technology, count: +d.count }))
        .sort((a, b) => b.count - a.count);
      setData(sortedData);
    });
  }, []);

  return (
    <main className="h-full flex flex-col items-center gap-5 p-10 max-h-screen w-full">
      <h1 className="text-3xl font-bold">Bar Chart</h1>
      <BarChart data={data} className="min-h-56 w-" />
    </main>
  );
};

export default Page;
