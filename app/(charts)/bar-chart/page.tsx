"use client";

const metrics = [
  "windSpeed",
  "moonPhase",
  "dewPoint",
  "humidity",
  "uvIndex",
  "windBearing",
  "temperatureMin",
  "temperatureMax",
];

import { WeatherData } from "@/app/data";
import { BarChart } from "@/components/charts/bar-chart";
import React from "react";
import { Button } from "@/components/ui/button";

const BarChartPage = () => {
  const [data, setData] = React.useState<{
    xAxisTitle: string;
    data: any[];
  }>({
    xAxisTitle: "humidity",
    data: WeatherData.map((item) => item.humidity),
  });

  return (
    <main className="min-h-screen flex flex-col items-center gap-5 p-24">
      <Button
        onClick={() => {
          const randomValue = Math.floor(Math.random() * metrics.length);
          const metric: string = metrics[randomValue];
          setData({
            xAxisTitle: metric,
            data: WeatherData.map((item: any) => item[metric]),
          });
        }}
      >
        Change Data
      </Button>
      <BarChart data={data.data} xAxisTitle={data.xAxisTitle} />
    </main>
  );
};

export default BarChartPage;
