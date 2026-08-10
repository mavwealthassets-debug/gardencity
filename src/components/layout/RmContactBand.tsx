import { Phone, ShieldCheck, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { relationshipManagers } from "@/data/users";

export function RmContactBand({ rmId = "rm-sandeep" }: { rmId?: string }) {
  const rm = relationshipManagers.find((r) => r.id === rmId) ?? relationshipManagers[0];

  return (
    <div className="flex min-h-[106px] flex-col justify-center gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar name={rm.name} size="md" />
        <div className="min-w-0 leading-tight">
          <p className="text-xs leading-5 text-neutral-500">Your Relationship Manager</p>
          <p className="flex items-center gap-1.5 text-sm font-semibold leading-5 text-neutral-900">
            {rm.name}
            <ShieldCheck size={14} className="text-brand-600" aria-label="Verified" />
          </p>
          <p className="text-xs leading-5 text-neutral-500">We're here to help you with any query or assistance.</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3 sm:border-l sm:border-t-0 sm:py-1 sm:pl-5">
        <a href={`tel:${rm.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-neutral-700 hover:text-brand-700">
          <Phone size={15} /> {rm.phone}
        </a>
        <a
          href={`https://wa.me/${rm.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-status-available hover:underline"
        >
          <MessageCircle size={15} /> Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
