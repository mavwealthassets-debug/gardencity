import { useMemo, useState } from "react";
import { Users, CheckCircle2, Gift, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Tabs } from "@/components/common/Tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Modal } from "@/components/common/Modal";
import { Input, Checkbox } from "@/components/common/Field";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDate, formatINR } from "@/lib/format";
import type { Referral } from "@/types";

const TABS = [
  { value: "referrals", label: "Referrals" },
  { value: "benefits", label: "My Benefits" },
];

export default function ReferralsPage() {
  const { buyer } = useCurrentBuyer();
  const { referrals, addReferral } = useAppData();
  const { toast } = useToast();
  const [tab, setTab] = useState("referrals");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const myReferrals = useMemo(
    () => referrals.filter((r) => r.referrerBuyerId === buyer.id).sort((a, b) => new Date(b.referredOn).getTime() - new Date(a.referredOn).getTime()),
    [referrals, buyer.id]
  );

  const stats = {
    total: myReferrals.length,
    successful: myReferrals.filter((r) => r.status === "Converted").length,
    earned: myReferrals.filter((r) => r.rewardStatus === "Processed").reduce((s, r) => s + r.rewardAmount, 0),
  };

  function submitReferral() {
    if (!name.trim() || !consent) {
      toast({ variant: "error", title: "Please fill in the details and accept the consent." });
      return;
    }
    const referral: Referral = {
      id: `ref-new-${Date.now()}`,
      referrerBuyerId: buyer.id,
      referredName: name,
      referredEmail: email,
      referredPhone: phone,
      status: "Eligible",
      rewardAmount: 25000,
      rewardStatus: "Pending",
      referredOn: new Date().toISOString().slice(0, 10),
    };
    addReferral(referral);
    toast({ variant: "success", title: "Referral submitted", description: `${name} has been added to your referral list.` });
    setShowModal(false);
    setName(""); setEmail(""); setPhone(""); setConsent(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Referrals</h1>
          <p className="mt-1 text-sm text-neutral-500">Refer your friends to Garden City Naugaon and earn exciting benefits.</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Users size={15} /> Refer a Friend</Button>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "referrals" && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card className="min-h-[82px]"><CardContent className="flex h-full items-center gap-4 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-status-info-bg text-status-info"><Users size={18} /></span><div className="leading-tight"><p className="text-xl font-bold text-neutral-900">{stats.total}</p><p className="mt-1 text-xs text-neutral-500">Total Referrals</p></div></CardContent></Card>
            <Card className="min-h-[82px]"><CardContent className="flex h-full items-center gap-4 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-status-available-bg text-status-available"><CheckCircle2 size={18} /></span><div className="leading-tight"><p className="text-xl font-bold text-neutral-900">{stats.successful}</p><p className="mt-1 text-xs text-neutral-500">Successful Referrals</p></div></CardContent></Card>
            <Card className="min-h-[82px]"><CardContent className="flex h-full items-center gap-4 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-status-booked-bg text-status-booked"><Gift size={18} /></span><div className="leading-tight"><p className="text-xl font-bold text-neutral-900">{formatINR(stats.earned)}</p><p className="mt-1 text-xs text-neutral-500">Benefits Earned</p></div></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Your Referrals</CardTitle></CardHeader>
            <CardContent>
              {myReferrals.length === 0 ? (
                <EmptyState title="No referrals yet" description="Start referring friends and family to earn rewards." action={<Button size="sm" onClick={() => setShowModal(true)}>Refer a Friend</Button>} className="py-10" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead className="text-left text-xs uppercase text-neutral-400"><tr><th className="py-2">Referred To</th><th>Status</th><th>Plot</th><th className="text-right">Reward</th><th className="text-right">Date</th></tr></thead>
                    <tbody className="divide-y divide-border">
                      {myReferrals.map((r) => (
                        <tr key={r.id}>
                          <td className="py-2.5"><span className="block font-medium text-neutral-800">{r.referredName}</span><span className="block text-xs text-neutral-400">{r.referredEmail}</span></td>
                          <td><StatusBadge tone={r.status === "Converted" ? "green" : r.status === "Lost" ? "red" : "blue"} dot={false}>{r.status}</StatusBadge></td>
                          <td className="whitespace-nowrap">{r.plotId ?? "—"}</td>
                          <td className="whitespace-nowrap text-right font-medium text-neutral-800">{formatINR(r.rewardAmount)}</td>
                          <td className="whitespace-nowrap text-right">{formatDate(r.referredOn)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-surface-subtle p-2.5 text-xs text-neutral-500">
                Referral benefit is credited after successful registration and payment completion by your friend.
              </p>
            </CardContent>
          </Card>

          <Card className="border-brand-200 bg-brand-50/60">
            <CardContent className="flex min-h-[82px] flex-col justify-center gap-3 p-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div>
                <p className="text-base font-semibold text-neutral-900">Refer More, Earn More!</p>
                <p className="text-sm text-neutral-600">Invite friends and family to own a plot at Garden City Naugaon and earn exciting benefits.</p>
              </div>
              <Button onClick={() => setShowModal(true)}><Users size={15} /> Refer a Friend</Button>
            </CardContent>
          </Card>
        </>
      )}

      {tab === "benefits" && (
        <Card>
          <CardHeader><CardTitle>Referral Program Terms</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600">
              <li>Earn ₹25,000 cashback for every successful referral that completes registration and payment.</li>
              <li>Rewards are processed within 15 working days of the referred buyer's registration.</li>
              <li>There is no limit to the number of friends you can refer.</li>
              <li>Referral rewards are subject to the terms of the Garden City Naugaon referral program.</li>
            </ul>
          </CardContent>
        </Card>
      )}

      <RmContactBand rmId={buyer.assignedRmId} />

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Refer a Friend"
        description="Share the details of your friend or family member below."
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={submitReferral}><Send size={15} /> Submit Referral</Button></>}
      >
        <div className="flex flex-col gap-4">
          <Input label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Friend's full name" />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="friend@email.com" />
          <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          <Checkbox
            label="I confirm my friend has consented to being contacted by Garden City Naugaon regarding this referral."
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
        </div>
      </Modal>
    </div>
  );
}
