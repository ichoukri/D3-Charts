import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center gap-5">
        <Link href="/bar-chart">
          <Button>Bar Chart</Button>
        </Link>
        <Link href="/line-chart">
          <Button>Line Chart</Button>
        </Link>
      </div>
    </main>
  );
}
