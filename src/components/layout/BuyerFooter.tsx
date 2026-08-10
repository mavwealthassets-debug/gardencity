import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Logo } from "@/components/common/Logo";

const SOCIAL_ICON_PATHS: Record<string, string> = {
  Facebook: "M13.5 9H15V6.5h-1.5C11.6 6.5 10.5 7.6 10.5 9v1.5H9V13h1.5v6.5H13V13h1.7l.3-2.5h-2V9c0-.3.2-.5.5-.5Z",
  Instagram:
    "M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5Zm0 1.5A3 3 0 0 0 5 8v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4.6-2.4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
  Youtube:
    "M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.7v1.6c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.9.8 2.3.9 1.7.2 7.2.2 7.5.2s5.9 0 7.6-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.5v-1.6c0-1.8-.2-3.5-.2-3.5ZM9.9 14.6V8.9l5.6 2.9-5.6 2.8Z",
  Linkedin:
    "M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6v6.3h-4v-5.6c0-1.3 0-3-1.8-3-1.9 0-2.2 1.5-2.2 3v5.6h-4V9Z",
};

function SocialIcon({ name }: { name: keyof typeof SOCIAL_ICON_PATHS }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={SOCIAL_ICON_PATHS[name]} />
    </svg>
  );
}

export function BuyerFooter() {
  return (
    <footer className="mt-8 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-10">
        <div>
          <Logo size="sm" />
          <ul className="mt-3 flex flex-col gap-1.5 text-sm leading-5 text-neutral-500">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0" /> Naugaon, District Nuh, Haryana - 122105
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="shrink-0" /> +91 1800 123 4567
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="shrink-0" /> support@gardencity.com
            </li>
            <li className="flex items-start gap-2">
              <Clock size={15} className="mt-0.5 shrink-0" /> Mon - Sat (10 AM - 7 PM)
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Quick Links</p>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm leading-5 text-neutral-500">
            <li>About Project</li>
            <li>Amenities</li>
            <li>Master Plan</li>
            <li>Payment Plan</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Buyer Support</p>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm leading-5 text-neutral-500">
            <li>Help Center</li>
            <li>Raise a Ticket</li>
            <li>Grievance Redressal</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Follow Us</p>
          <div className="mt-3 flex gap-2">
            {(["Facebook", "Instagram", "Youtube", "Linkedin"] as const).map((name) => (
              <span key={name} className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-neutral-500">
                <SocialIcon name={name} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-3 text-center text-xs text-neutral-400 sm:px-6">
        © 2026 Garden City Naugaon. All rights reserved.
      </div>
    </footer>
  );
}
