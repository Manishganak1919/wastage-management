import {
  ArrowRight,
  Leaf,
  Recycle,
  Users,
  Coins,
  MapPin,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnimateGlobe() {
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
