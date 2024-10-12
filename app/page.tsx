"use client";
import { useState } from "react";
import {
  ArrowRight,
  Leaf,
  Recycle,
  Users,
  Coins,
  FileText,
  MapPin,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

// AnimateGlobe component
function AnimateGlobe() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-0 rounded-full bg-orange-500 opacity-20 animate-pulse">
        <div className="absolute inset-2 rounded-full bg-orange-400 opacity-40 animate-ping">
          <div className="absolute inset-4 rounded-full bg-orange-300 opacity-60 animate-spin">
            <div className="absolute inset-6 rounded-full bg-orange-300 opacity-60 animate-bounce">
              <Leaf className="absolute inset-0 m-auto h-16 w-16 text-white animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//Feature card component
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    setFlipped(!flipped);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-64 bg-white rounded-xl shadow-md cursor-pointer perspective-1000"
    >
      {/* Wrapper for the flip effect */}
      <div
        className={`relative w-full h-full transition-transform duration-500 transform ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center backface-hidden">
          <div className="bg-orange-100 p-4 rounded-full my-6">
            <Icon className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full bg-orange-100 rounded-xl flex items-center justify-center transform rotate-y-180 backface-hidden">
          <h2 className="text-2xl font-bold text-orange-600">Thank You!</h2>
        </div>
      </div>
    </div>
  );
}

//impact card
function ImpactCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString("en-US", { maximumFractionDigits: 1 })
      : value;

  return (
    <div className="p-6 rounded-xl bg-orange-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md">
      <Icon className="h-10 w-10 text-orange-500 mb-4" />
      <p className="text-3xl font-bold mb-2 text-gray-800">{formattedValue}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

// Home component
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center mb-20">
        <AnimateGlobe />
        <h1 className="text-6xl font-bold mb-6 text-gray-800 tracking-tight">
          Waste <span className="text-orange-600">Pro</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Join our community in making waste management more efficient and
          rewarding!
        </p>
      </section>
      <section className="grid md:grid-cols-3 gap-10 mb-20">
        <FeatureCard
          icon={Leaf}
          title="Eco-Friendly"
          description="Contribute to a cleaner environment by reporting and collecting waste."
        />
        <FeatureCard
          icon={Coins}
          title="Earn Rewards"
          description="Get tokens for your contributions to waste management efforts."
        />
        <FeatureCard
          icon={Users}
          title="Community-Driven"
          description="Be part of a growing community committed to sustainable practices."
        />
      </section>
      <section className="bg-white p-10 rounded-3xl shadow-lg mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
          Our Impact
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <ImpactCard title="Waste Collected" value={5000} icon={Recycle} />
          <ImpactCard title="Reports Submitted" value={350} icon={FileText} />
          <ImpactCard title="Tokens Earned" value={1500} icon={Coins} />
          <ImpactCard title="CO2 Offset" value="2,500 kg" icon={Leaf} />
        </div>
      </section>
    </div>
  );
}
