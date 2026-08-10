import { useMemo, useState } from "react";
import { Users, CalendarClock, Send, CalendarCheck, Gift, Phone, Plus, Gift as GiftIcon, Megaphone, PartyPopper, UsersRound } from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { Avatar } from "@/components/common/Avatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { Textarea, Select } from "@/components/common/Field";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { relationshipManagers } from "@/data/users";
import { getCommunicationsForBuyer } from "@/data/communications";
import { referrals as allReferrals } from "@/data/referrals";
import { Pagination } from "@/components/common/Pagination";

const REFERRALS_PAGE_SIZE = 3;

export default function RelationshipsPage() {
  const { buyers } = useAppData();
  const { toast } = useToast();
  const activeBuyers = useMemo(() => buyers.filter((b) => b.plotId), [buyers]);
  const selectedId = activeBuyers[0]?.id;
  const [showLog, setShowLog] = useState(false);
  const [note, setNote] = useState("");
  const [referralPage, setReferralPage] = useState(1);
  const referralTotalPages = Math.max(1, Math.ceil(allReferrals.length / REFERRALS_PAGE_SIZE));
  const currentReferralPage = Math.min(referralPage, referralTotalPages);
  const pagedReferrals = allReferrals.slice((currentReferralPage - 1) * REFERRALS_PAGE_SIZE, currentReferralPage * REFERRALS_PAGE_SIZE);

  const selected = activeBuyers.find((b) => b.id === selectedId) ?? activeBuyers[0];
  const rm = relationshipManagers.find((r) => r.id === selected?.assignedRmId);
  const timeline = useMemo(() => (selected ? getCommunicationsForBuyer(selected.id, false) : []), [selected]);

  const stats = {
    active: activeBuyers.length,
    followUps: buyers.filter((b) => b.nextFollowUp).length,
    updatesSent: 128,
    meetings: 27,
    referrals: allReferrals.length,
    calls: 41,
  };

  function logCommunication() {
    toast({ variant: "success", title: "Communication logged", description: note || "Follow-up call logged for this buyer." });
    setShowLog(false);
    setNote("");
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 overflow-x-hidden pb-8">
      <div className="border-b border-border px-4 py-2.5 sm:px-6"><h1 className="text-xl font-bold text-neutral-900">Relationships</h1><p className="text-xs text-neutral-500">Strengthen post-sale relationships and build lifelong value.</p></div>

      <div className="flex flex-col gap-3 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard className="h-[92px]" label="Active Relationships" value="186" icon={Users} iconTone="green" sublabel="▲ 12.5% vs last month" progressPercent={100} />
          <MetricCard className="h-[92px]" label="Follow-ups Due" value="34" icon={CalendarClock} iconTone="orange" sublabel="▲ 18.2% vs last month" progressPercent={100} />
          <MetricCard className="h-[92px]" label="Updates Sent" value={String(stats.updatesSent)} icon={Send} iconTone="blue" sublabel="▲ 22.4% vs last month" progressPercent={100} />
          <MetricCard className="h-[92px]" label="Meetings Scheduled" value={String(stats.meetings)} icon={CalendarCheck} iconTone="purple" sublabel="▲ 8.3% vs last month" progressPercent={100} />
          <MetricCard className="h-[92px]" label="Referral Requests" value="19" icon={Gift} iconTone="orange" sublabel="▲ 5.6% vs last month" progressPercent={100} />
          <MetricCard className="h-[92px]" label="Support Calls" value={String(stats.calls)} icon={Phone} iconTone="red" sublabel="▲ 11.7% vs last month" progressPercent={100} />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 xl:h-[530px] xl:grid-cols-[285px_minmax(0,1fr)_minmax(320px,0.72fr)]">
          <div className="flex min-h-0 flex-col gap-2">
            <Card className="h-[290px] overflow-hidden">
              <CardHeader className="px-4 py-3"><CardTitle>Buyer Profile</CardTitle><Button variant="link" size="sm">View Full Profile</Button></CardHeader>
              <CardContent className="space-y-3 px-4 pb-4 pt-1 sm:px-4 sm:pb-4 sm:pt-1">
                <div className="flex min-h-[64px] items-center gap-3">
                  <Avatar name={selected?.name ?? "Buyer"} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold leading-5">{selected?.name}</p><StatusBadge tone="green">Active</StatusBadge></div>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">{selected?.phone}</p>
                    <p className="truncate text-xs leading-5 text-neutral-500">{selected?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-3 rounded-lg bg-emerald-50 p-3 text-xs">
                  <div className="min-w-0"><span className="block leading-4 text-neutral-500">Project</span><p className="mt-0.5 font-medium leading-4">Garden City<br />Naugaon</p></div>
                  <div><span className="block leading-4 text-neutral-500">Plot No.</span><p className="mt-0.5 font-medium leading-4">{selected?.plotId}</p></div>
                  <div><span className="block leading-4 text-neutral-500">Booking Date</span><p className="mt-0.5 font-medium leading-4">12 Jan 2025</p></div>
                  <div><span className="block leading-4 text-neutral-500">Possession</span><p className="mt-0.5 font-medium leading-4">Dec 2025</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="min-h-0 flex-1 overflow-hidden">
              <CardHeader className="py-3"><CardTitle>Relationship Manager</CardTitle></CardHeader>
              <CardContent className="space-y-2 pb-2"><div className="flex items-center gap-2"><Avatar name={rm?.name ?? "Manager"} size="sm"/><div><p className="text-sm font-semibold">{rm?.name}</p><p className="text-[10px] text-neutral-500">Relationship Manager · {rm?.phone}</p></div></div><div className="grid grid-cols-2 gap-2 border-t border-border pt-2 text-[10px]"><div><span className="text-neutral-500">Last Contact</span><p className="font-medium">May 28, 2025</p></div><div><span className="text-neutral-500">Next Follow-up</span><p className="font-medium">Jun 04, 2025</p></div></div><Button variant="secondary" className="h-7 w-full" size="sm" onClick={() => setShowLog(true)}>Log New Activity</Button></CardContent>
            </Card>
          </div>

          <div className="flex h-[410px] min-h-0 flex-col gap-2">
            {selected && (
              <Card className="hidden">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={selected.name} size="md" />
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900">{selected.name} <StatusBadge tone="green" dot={false}>{selected.status}</StatusBadge></p>
                      <p className="text-xs text-neutral-500">{selected.plotId} · RM: {rm?.name}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setShowLog(true)}><Plus size={14} /> Log Communication</Button>
                </CardContent>
              </Card>
            )}

            <Card className="min-h-0 flex-1 overflow-hidden">
              <CardHeader className="py-3"><CardTitle>Communication Timeline</CardTitle><Button variant="link" size="sm">View All</Button></CardHeader>
              <CardContent className="px-4 pb-3">
                {timeline.length === 0 ? (
                  <EmptyState title="No communication history" className="py-8" />
                ) : (
                  <ul className="flex flex-col gap-2">
                    {timeline.slice(0, 6).map((c) => (
                      <li key={c.id} className="grid min-h-[43px] grid-cols-[82px_12px_minmax(0,1fr)] gap-2">
                        <p className="text-[10px] leading-tight text-neutral-500">{formatDate(c.date)}<br />{new Date(c.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-neutral-800">{c.subject}</p>
                          <p className="text-[11px] text-neutral-500">{c.body}</p>
                          <p className="text-[10px] text-neutral-400">{c.channel} · {c.from} · {formatDateTime(c.date)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="h-[410px] min-h-0">
            <Card className="h-full overflow-hidden">
              <CardHeader className="py-3"><CardTitle>Customer Engagement</CardTitle><Button variant="link" size="sm">Create New</Button></CardHeader>
              <CardContent className="flex flex-col gap-0 px-4 pb-3">
                <EngagementRow icon={PartyPopper} title="Festival Greetings" desc="Send personalized festival wishes to buyers." action="Send Wishes" onClick={() => toast({ variant: "success", title: "Festive wishes sent" })} />
                <EngagementRow icon={Megaphone} title="Project Updates" desc="Share latest development photos and progress." action="Send Update" onClick={() => toast({ variant: "success", title: "Project update sent to buyers" })} />
                <EngagementRow icon={CalendarCheck} title="Site Event Invitations" desc="Invite buyers to site visits and gatherings." action="Create Invite" onClick={() => toast({ variant: "success", title: "Site visit invite created" })} />
                <EngagementRow icon={GiftIcon} title="Referral Campaigns" desc="Encourage referrals with rewards." action="Launch Campaign" onClick={() => toast({ variant: "success", title: "Referral campaign launched" })} />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="min-h-[260px] min-w-0 xl:-mt-[88px] xl:ml-[297px]">
          <CardHeader className="py-2.5">
            <CardTitle>Recent Referrals</CardTitle>
            <Button variant="link" size="sm" onClick={() => toast({ variant: "info", title: "Opening all referrals" })}>View All Referrals</Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-xs uppercase text-neutral-400">
                  <tr>
                    <th className="py-1 pr-3">Referrer</th>
                    <th className="px-3 py-2">Referred To</th>
                    <th className="px-3 py-2">Plot</th>
                    <th className="px-3 py-2 text-right">Reward</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="pl-3 py-2 text-right">Referred On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {pagedReferrals.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap py-1.5 pr-3 font-medium text-neutral-800">{buyers.find((b) => b.id === r.referrerBuyerId)?.name ?? "Buyer"}</td>
                      <td className="px-3 py-1.5">
                        <span className="block text-neutral-800">{r.referredName}</span>
                        <span className="block text-xs text-neutral-400">{r.referredEmail}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-1.5">{r.plotId ?? "—"}</td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-right font-medium text-neutral-800">{formatINR(r.rewardAmount)}</td>
                      <td className="px-3 py-1.5"><StatusBadge tone={r.status === "Converted" ? "green" : "blue"} dot={false}>{r.status}</StatusBadge></td>
                      <td className="whitespace-nowrap pl-3 py-1.5 text-right text-neutral-500">{formatDate(r.referredOn)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={currentReferralPage} totalPages={referralTotalPages} onPageChange={setReferralPage} totalItems={allReferrals.length} pageSize={REFERRALS_PAGE_SIZE} />
          </CardContent>
        </Card>
      </div>

      <Modal
        open={showLog}
        onClose={() => setShowLog(false)}
        title="Log Communication"
        description={selected ? `Add a new communication or follow-up entry for ${selected.name}.` : undefined}
        footer={<><Button variant="secondary" onClick={() => setShowLog(false)}>Cancel</Button><Button onClick={logCommunication}>Save Entry</Button></>}
      >
        <div className="flex flex-col gap-4">
          <Select label="Channel" defaultValue="Call">
            {["Call", "WhatsApp", "Email", "Meeting", "Message"].map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Textarea label="Notes" placeholder="Summarize the conversation..." value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
        </div>
      </Modal>
    </div>
  );
}

function EngagementRow({ icon: Icon, title, desc, action, onClick }: { icon: typeof UsersRound; title: string; desc: string; action: string; onClick: () => void }) {
  return (
    <div className="flex min-h-[66px] items-center gap-3 border-b border-border py-2 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon size={16} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-neutral-800">{title}</p>
        <p className="text-[11px] leading-tight text-neutral-500">{desc}</p>
      </div>
      <Button size="sm" className="h-7 whitespace-nowrap px-3 text-[11px]" variant="secondary" onClick={onClick}>{action}</Button>
    </div>
  );
}
