import { useMemo, useState } from "react";
import { MessageSquare, Phone, Mail, Bell, Plus, Send } from "lucide-react";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Tabs } from "@/components/common/Tabs";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge, ticketStatusTone } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Modal } from "@/components/common/Modal";
import { Select, Textarea, Input } from "@/components/common/Field";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { useToast } from "@/app/toast";
import { formatDateTime } from "@/lib/format";
import { getCommunicationsForBuyer } from "@/data/communications";

const TABS = [
  { value: "all", label: "All" },
  { value: "Message", label: "Messages" },
  { value: "Call", label: "Calls" },
  { value: "Email", label: "Emails" },
  { value: "Notice", label: "Notices" },
];

const CHANNEL_ICON: Record<string, typeof MessageSquare> = { Message: MessageSquare, Call: Phone, Email: Mail, Notice: Bell, WhatsApp: MessageSquare, Meeting: Phone, System: Bell };

export default function CommunicationPage() {
  const { buyer } = useCurrentBuyer();
  const { toast } = useToast();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);

  const items = useMemo(() => getCommunicationsForBuyer(buyer.id, false), [buyer.id]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => (tab === "all" || c.channel === tab) && (!q || c.subject.toLowerCase().includes(q)));
  }, [items, tab, query]);

  const counts = {
    all: items.length,
    Message: items.filter((c) => c.channel === "Message").length,
    Call: items.filter((c) => c.channel === "Call").length,
    Email: items.filter((c) => c.channel === "Email").length,
    Notice: items.filter((c) => c.channel === "Notice").length,
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Communication</h1>
          <p className="mt-1 text-sm text-neutral-500">Messages, calls, emails and notices — all in one place.</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus size={15} /> New Message</Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-5 p-5 sm:pt-5">
          <div className="flex min-h-10 flex-col gap-3 sm:flex-row sm:items-center">
            <Tabs tabs={TABS.map((t) => ({ ...t, count: counts[t.value as keyof typeof counts] }))} value={tab} onChange={setTab} className="border-b-0" />
            <SearchInput value={query} onChange={setQuery} placeholder="Search..." containerClassName="w-full sm:ml-auto sm:w-72 sm:shrink-0" className="h-9" />
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="No communication found" className="py-8" />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {filtered.map((c) => {
                const Icon = CHANNEL_ICON[c.channel] ?? MessageSquare;
                return (
                  <li key={c.id} className="flex flex-wrap items-start gap-3 py-3.5 sm:flex-nowrap">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-status-info-bg text-status-info"><Icon size={16} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-800">{c.subject}</p>
                      <p className="mt-0.5 text-sm text-neutral-500">{c.body}</p>
                      <p className="mt-1 text-xs text-neutral-400">From {c.from} · {formatDateTime(c.date)}</p>
                    </div>
                    <div className="ml-[3rem] shrink-0 sm:ml-0">
                      <StatusBadge tone={ticketStatusTone(c.status)} dot={false}>{c.status}</StatusBadge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <RmContactBand rmId={buyer.assignedRmId} />

      <Modal
        open={showNew}
        onClose={() => setShowNew(false)}
        title="New Message"
        description="Send a message to your relationship manager or the Garden City support team."
        footer={<>
          <Button variant="secondary" onClick={() => setShowNew(false)}>Cancel</Button>
          <Button onClick={() => { toast({ variant: "success", title: "Message sent" }); setShowNew(false); }}><Send size={15} /> Send Message</Button>
        </>}
      >
        <div className="flex flex-col gap-4">
          <Select label="To" defaultValue="rm">
            <option value="rm">Relationship Manager — Sandeep Singh</option>
            <option value="support">Garden City Support Team</option>
          </Select>
          <Input label="Subject" placeholder="e.g. Question about registration" />
          <Textarea label="Message" placeholder="Type your message..." rows={4} />
        </div>
      </Modal>
    </div>
  );
}
