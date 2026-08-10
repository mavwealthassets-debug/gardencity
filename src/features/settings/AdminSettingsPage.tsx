import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Tabs } from "@/components/common/Tabs";
import { Input, Select, Checkbox } from "@/components/common/Field";
import { Button } from "@/components/common/Button";
import { Avatar } from "@/components/common/Avatar";
import { useToast } from "@/app/toast";
import { useSession } from "@/app/session";
import { relationshipManagers } from "@/data/users";

const TABS = [
  { value: "profile", label: "Profile" },
  { value: "team", label: "Team & Roles" },
  { value: "notifications", label: "Notifications" },
  { value: "preferences", label: "Preferences" },
];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("profile");
  const { user } = useSession();
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-5 pb-10">
      <PageHeader title="Settings" description="Manage your CRM workspace, team access and preferences." />
      <div className="flex flex-col gap-5 px-4 sm:px-6">
        <Tabs tabs={TABS} value={tab} onChange={setTab} />

        {tab === "profile" && user && (
          <Card>
            <CardHeader><CardTitle>Admin Profile</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <Avatar name={user.name} size="xl" className="bg-brand-600 text-white" />
                <Button variant="secondary" size="sm">Change Photo</Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full Name" defaultValue={user.name} />
                <Input label="Email" type="email" defaultValue={user.email} />
                <Input label="Phone" defaultValue={user.phone} />
                <Input label="Designation" defaultValue={user.title} />
              </div>
              <Button className="w-fit" onClick={() => toast({ variant: "success", title: "Profile updated" })}>Save Changes</Button>
            </CardContent>
          </Card>
        )}

        {tab === "team" && (
          <Card>
            <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
            <CardContent>
              <ul className="flex flex-col divide-y divide-border">
                {relationshipManagers.map((rm) => (
                  <li key={rm.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="flex items-center gap-3">
                      <Avatar name={rm.name} size="sm" />
                      <span>
                        <span className="block text-sm font-medium text-neutral-800">{rm.name}</span>
                        <span className="block text-xs text-neutral-400">{rm.title}</span>
                      </span>
                    </span>
                    <Select defaultValue={rm.title} className="w-44" aria-label={`Role for ${rm.name}`}>
                      <option>Relationship Manager</option>
                      <option>Sales Executive</option>
                      <option>Document Verifier</option>
                      <option>Administrator</option>
                    </Select>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {tab === "notifications" && (
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Checkbox label="Email me daily collection summaries" defaultChecked />
              <Checkbox label="Notify me when a document needs verification" defaultChecked />
              <Checkbox label="Notify me for overdue payments beyond 30 days" defaultChecked />
              <Checkbox label="Notify me for new high-priority support tickets" defaultChecked />
              <Checkbox label="Weekly performance digest" />
              <Button className="mt-2 w-fit" onClick={() => toast({ variant: "success", title: "Notification preferences saved" })}>Save Preferences</Button>
            </CardContent>
          </Card>
        )}

        {tab === "preferences" && (
          <Card>
            <CardHeader><CardTitle>Workspace Preferences</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Default Currency Format" defaultValue="lakh-crore">
                <option value="lakh-crore">Lakh / Crore (₹12.85 Cr)</option>
                <option value="full">Full Number (₹1,28,50,000)</option>
              </Select>
              <Select label="Default Date Range" defaultValue="this-month">
                <option value="this-month">This Month</option>
                <option value="last-30">Last 30 Days</option>
                <option value="quarter">This Quarter</option>
              </Select>
              <Select label="Theme" defaultValue="light">
                <option value="light">Light</option>
                <option value="system">System</option>
              </Select>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
