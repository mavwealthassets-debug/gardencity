import { useState } from "react";
import { Lock, ShieldCheck, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Tabs } from "@/components/common/Tabs";
import { Input, Select } from "@/components/common/Field";
import { Avatar } from "@/components/common/Avatar";
import { Modal } from "@/components/common/Modal";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDate } from "@/lib/format";

const TABS = [
  { value: "details", label: "Profile Details" },
  { value: "password", label: "Change Password" },
];

export default function MyProfilePage() {
  const { buyer } = useCurrentBuyer();
  const { updateBuyer } = useAppData();
  const { toast } = useToast();
  const [tab, setTab] = useState("details");
  const [phone, setPhone] = useState(buyer.phone);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");

  function requestPhoneChange() {
    if (phone === buyer.phone) return;
    setPendingPhone(phone);
    setShowOtp(true);
  }

  function verifyOtp() {
    if (otp.length < 4) {
      toast({ variant: "error", title: "Enter the 4-digit OTP sent to your new number" });
      return;
    }
    updateBuyer(buyer.id, { phone: pendingPhone });
    toast({ variant: "success", title: "Phone number updated", description: "Your contact number has been verified and updated." });
    setShowOtp(false);
    setOtp("");
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">My Profile</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your personal information and account settings.</p>
      </div>

      <Card>
        <CardContent className="flex min-h-[124px] flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <Avatar name={buyer.name} size="xl" className="bg-brand-600 text-white" />
          <div className="flex-1">
            <p className="flex items-center gap-2 text-lg font-bold text-neutral-900">{buyer.name} <ShieldCheck size={16} className="text-brand-600" /></p>
            <p className="text-sm text-neutral-500">{buyer.purpose} Buyer</p>
          </div>
          <Button variant="secondary" size="sm" className="sm:ml-auto" onClick={() => toast({ variant: "info", title: "Choose a new profile photo" })}>Change Photo</Button>
        </CardContent>
      </Card>

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "details" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Input label="Full Name" defaultValue={buyer.name} />
              <Input label="Email" type="email" defaultValue={buyer.email} />
              <div>
                <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} hint="Changing this will require OTP verification." />
                {phone !== buyer.phone && (
                  <Button size="sm" className="mt-2" onClick={requestPhoneChange}>Verify & Update Number</Button>
                )}
              </div>
              <Input label="Address" defaultValue="123 Green Avenue, Sector 21, Gurugram, Haryana - 122105" />
              <Select label="Occupation" defaultValue="Business">
                <option>Business</option><option>Salaried</option><option>Professional</option><option>Other</option>
              </Select>
              <Button className="w-fit" onClick={() => toast({ variant: "success", title: "Profile updated" })}>Update Profile</Button>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader><CardTitle>Account Information</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <InfoRow label="Customer ID" value={`GCN-INV-${buyer.id.slice(-3).toUpperCase()}`} />
                <InfoRow label="Member Since" value={formatDate(buyer.buyerSince)} />
                <InfoRow label="Account Type" value={buyer.purpose} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Verified KYC Fields</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-3">
                <LockedField label="Legal Name (as per PAN)" value={buyer.name} />
                <LockedField label="PAN Number" value="ABCDE1234F" />
                <LockedField label="Aadhaar Number" value="XXXX XXXX 4321" />
                <p className="text-xs text-neutral-400">These fields are locked after KYC verification. Contact support to request a change.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === "password" && (
        <Card className="max-w-lg">
          <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
            <Button className="w-fit" onClick={() => toast({ variant: "success", title: "Password updated" })}><KeyRound size={15} /> Update Password</Button>
          </CardContent>
        </Card>
      )}

      <RmContactBand rmId={buyer.assignedRmId} />

      <Modal
        open={showOtp}
        onClose={() => setShowOtp(false)}
        title="Verify OTP"
        description={`An OTP has been sent to ${pendingPhone} to confirm this change.`}
        footer={<><Button variant="secondary" onClick={() => setShowOtp(false)}>Cancel</Button><Button onClick={verifyOtp}>Verify</Button></>}
      >
        <Input label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="4-digit code" maxLength={4} />
      </Modal>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 py-1.5 last:border-0">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium text-neutral-800">{value}</span>
    </div>
  );
}

function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface-subtle px-3 py-2 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="flex items-center gap-1.5 font-medium text-neutral-600"><Lock size={12} /> {value}</span>
    </div>
  );
}
