import { MapPin, Navigation, Clock, Phone, Mail, CalendarCheck, Sparkles, Users, ClipboardCheck, Headset, Phone as PhoneIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { gardenCityProject } from "@/data/project";

const SERVICES = [
  { icon: Sparkles, title: "Project Experience", desc: "Explore models, layouts and master plan." },
  { icon: Users, title: "Expert Consultation", desc: "Get guidance from our relationship managers." },
  { icon: ClipboardCheck, title: "Easy Booking", desc: "Hassle-free booking and documentation." },
  { icon: Headset, title: "Customer Support", desc: "End-to-end assistance at every step." },
];

const LANDMARKS = [
  { name: "Naugaon Town", distance: "2.5 km" },
  { name: "Nuh Bus Stand", distance: "8.2 km" },
  { name: "Firozpur Jhirka", distance: "12.7 km" },
  { name: "Tauru Railway Station", distance: "24.3 km" },
  { name: "IGI Airport, Delhi", distance: "72.4 km" },
];

export default function SalesOfficePage() {
  const { buyer } = useCurrentBuyer();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Garden City Naugaon Sales Office</h1>
        <p className="mt-1 text-sm text-neutral-500">Visit our Sales Office to explore the project, get expert guidance, and take the next step toward your dream home.</p>
      </div>

      <Card className="overflow-hidden">
        <img src={gardenCityProject.heroImage} alt="Garden City Naugaon sales office" className="h-48 w-full object-cover sm:h-auto sm:aspect-[878/295]" />
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex min-w-0 items-start gap-2 text-sm text-neutral-600"><MapPin size={16} className="mt-0.5 shrink-0 text-brand-700" /> <span className="break-words">{gardenCityProject.location}</span></p>
          <Button className="w-full sm:w-auto" variant="secondary" onClick={() => window.location.assign("https://www.google.com/maps/search/?api=1&query=Garden+City+Naugaon+Haryana")}><Navigation size={15} /> Get Directions</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile icon={Clock} label="Office Timings" value="10:00 AM – 7:00 PM" />
        <InfoTile icon={Phone} label="Phone" value="+91 1800 123 4567" />
        <InfoTile icon={Mail} label="Email" value="support@gardencity.com" />
        <InfoTile icon={CalendarCheck} label="Best Time to Visit" value="Weekdays 11 AM–5 PM" />
      </div>

      <Card>
        <CardHeader><CardTitle>About Our Sales Office</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            The Garden City Naugaon Sales Office is your one-stop destination to experience the project firsthand. Our team is here to help you with site visits, bookings, documentation, and all your queries regarding plots, amenities, and offers.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700"><s.icon size={18} /></span>
                <p className="mt-2 text-xs font-semibold text-neutral-800">{s.title}</p>
                <p className="text-xs text-neutral-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Nearby Landmarks</CardTitle></CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y divide-border text-sm">
              {LANDMARKS.map((l) => (
                <li key={l.name} className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2 text-neutral-700"><MapPin size={13} className="text-neutral-400" /> {l.name}</span>
                  <span className="font-medium text-neutral-500">{l.distance}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="flex min-h-[360px] flex-col">
          <CardHeader><CardTitle>Visit Us Today!</CardTitle></CardHeader>
          <CardContent className="flex flex-1 flex-col gap-5 pb-5">
            <div className="flex h-40 items-center justify-center rounded-lg bg-surface-subtle text-sm text-neutral-400">Map preview</div>
            <div className="mt-auto">
              <p className="text-sm leading-6 text-neutral-600">We welcome you to visit our Sales Office, take a guided tour, and discover why Garden City Naugaon is the perfect place for your future.</p>
              <Button className="mt-4 w-full" onClick={() => { window.location.href = "tel:+9118001234567"; }}><PhoneIcon size={15} /> Call Sales Office</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <RmContactBand rmId={buyer.assignedRmId} />
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <Card className="min-h-[72px]">
      <CardContent className="flex h-full items-center gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700"><Icon size={16} /></span>
        <div className="min-w-0">
          <p className="text-xs leading-4 text-neutral-400">{label}</p>
          <p className="break-words text-[13px] font-semibold leading-5 text-neutral-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
