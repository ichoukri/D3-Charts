import { D3LineChart } from "@/components/charts/d3-line-chart";
import { Scatterplot } from "@/components/charts/scatterplot";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Scatterplot />
    </main>
  );
}
