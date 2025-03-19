import { Header } from "@/components/header";
import { FlyerCreator } from "@/components/flyer-creator";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />
      <FlyerCreator />
    </main>
  );
}