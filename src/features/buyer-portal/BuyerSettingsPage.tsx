import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Checkbox, Select } from "@/components/common/Field";
import { Button } from "@/components/common/Button";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { useToast } from "@/app/toast";

export default function BuyerSettingsPage() {
  const { buyer } = useCurrentBuyer();
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage how Garden City Naugaon communicates with you.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Checkbox label="Email me about installment due dates" defaultChecked />
          <Checkbox label="SMS reminders for upcoming payments" defaultChecked />
          <Checkbox label="Notify me about new project updates" defaultChecked />
          <Checkbox label="Notify me about registration milestones" defaultChecked />
          <Checkbox label="Promotional offers and referral campaigns" />
          <Button className="mt-2 w-fit" onClick={() => toast({ variant: "success", title: "Preferences saved" })}>Save Preferences</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Language & Region</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Language" defaultValue="en">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </Select>
          <Select label="Currency Format" defaultValue="lakh-crore">
            <option value="lakh-crore">Lakh / Crore (₹43.50 L)</option>
            <option value="full">Full Number (₹43,50,000)</option>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-neutral-500">
          <p>Logged in as <span className="font-medium text-neutral-800">{buyer.email}</span></p>
          <p>Need to deactivate your account or request data export? Contact our support team.</p>
        </CardContent>
      </Card>

      <RmContactBand rmId={buyer.assignedRmId} />
    </div>
  );
}
