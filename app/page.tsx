import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/bar-chart">
        <Button>Bar Chart</Button>
      </Link>
    </main>
  );
}
