import Features from "@/components/custom/features";
import Hero from "@/components/custom/hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans  sm:p-20">


        <Hero />
        <Features />

    </div>
  );
}
