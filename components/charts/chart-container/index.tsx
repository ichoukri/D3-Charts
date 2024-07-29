"use client";

import { cn } from "@/lib/utils";
import React, { createContext, useEffect, useState } from "react";

export const ChartContext = createContext<{
  width: number | undefined;
  height: number | undefined;
  data: any[] | undefined;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
} | null>(null);

interface ChartContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export const ChartContainer = ({
  className = "",
  children = null,
}: ChartContainerProps) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setWidth(width);
      setHeight(height);

      addEventListener("resize", () => {
        const { width, height } = containerRef.current!.getBoundingClientRect();
        setWidth(width);
        setHeight(height);
      });
    }
  }, []);

  return (
    <ChartContext.Provider
      value={{
        width,
        height,
        data,
        setData,
      }}
    >
      <div
        className={cn("flex aspect-video justify-center text-xs", className)}
        ref={containerRef}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
};
