"use client";

import { ChartContainer } from "@/components/charts/chart-container";
import { LineChart } from "@/components/charts/line-chart";
import { Line } from "@/components/charts/line-chart/line";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ChartContainer className="w-1/2 max-h-[40rem] w">
        <LineChart data={chartData}>
          <Line dataKey="desktop" />
          <Line dataKey="mobile" stroke="#0000FF" />
        </LineChart>
      </ChartContainer>
    </main>
  );
};

export default page;
