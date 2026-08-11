import {
  Baby,
  Brain,
  Cctv,
  CloudRain,
  DoorOpen,
  Droplets,
  Dumbbell,
  Factory,
  Footprints,
  Goal,
  HeartPulse,
  Medal,
  Route,
  ScanFace,
  ShieldCheck,
  ShoppingCart,
  SolarPanel,
  SquareParking,
  Trees,
  Trophy,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { gardenCityProject } from "@/data/project";

const AMENITY_ICONS: LucideIcon[] = [
  ShieldCheck,
  Dumbbell,
  Waves,
  Route,
  Trees,
  Baby,
  Goal,
  Medal,
  Footprints,
  Brain,
  HeartPulse,
  Trees,
  ShoppingCart,
  Footprints,
  SquareParking,
  SolarPanel,
  Cctv,
  Trophy,
  Wind,
  Factory,
  CloudRain,
  ShieldCheck,
  ScanFace,
  Droplets,
];

export default function AmenitiesPage() {
  return (
    <div className="min-h-full bg-surface px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-700">Lifestyle Amenities</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl lg:text-5xl">Every Day Feels Like a Retreat</h1>
          <span className="mx-auto mt-4 block h-0.5 w-12 bg-amber-500" />
          <p className="mt-5 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Garden City is built for complete, enriched living. From active recreation to quiet green moments — every detail is designed to elevate your everyday.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {gardenCityProject.amenities.map((amenity, index) => {
            const Icon = AMENITY_ICONS[index] ?? DoorOpen;
            return (
              <article key={amenity} className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-border bg-white p-4 text-center transition-shadow hover:shadow-popover sm:min-h-40">
                <Icon size={30} strokeWidth={2.2} className="text-brand-600" aria-hidden="true" />
                <h2 className="mt-4 text-sm font-bold leading-snug text-neutral-900 sm:text-base">{amenity}</h2>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
