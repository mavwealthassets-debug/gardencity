import { useMemo, useState } from "react";
import { Download, Upload, ShieldCheck, Lock, FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Tabs } from "@/components/common/Tabs";
import { StatusBadge, docStatusTone } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Modal } from "@/components/common/Modal";
import { Select } from "@/components/common/Field";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDate } from "@/lib/format";
import type { DocumentCategory, DocumentItem } from "@/types";

const TABS = [
  { value: "all", label: "All Documents" },
  { value: "KYC", label: "KYC Documents" },
  { value: "Property", label: "Property Documents" },
  { value: "Financial", label: "Financial Documents" },
];

const MISSING_DOCS = ["Bank Statement (Latest 3 months)"];

export default function MyDocumentsPage() {
  const { buyer, plot } = useCurrentBuyer();
  const { documents, uploadDocument } = useAppData();
  const { toast } = useToast();
  const [tab, setTab] = useState("all");
  const [showUpload, setShowUpload] = useState(false);

  const myDocs = useMemo(
    () =>
      documents
        .filter((d) => d.buyerId === buyer.id)
        .filter((d) => tab === "all" || d.category === tab)
        .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()),
    [documents, buyer.id, tab]
  );

  function handleUpload() {
    const doc: DocumentItem = {
      id: `doc-buyer-${Date.now()}`,
      buyerId: buyer.id,
      plotId: plot.plotNo,
      name: "Bank Statement (Latest 3 months)",
      category: "Financial",
      status: "Pending",
      uploadedBy: buyer.name,
      uploadedByRole: "Buyer",
      uploadDate: new Date().toISOString().slice(0, 10),
      fileSizeKb: 1450,
      fileType: "PDF",
      version: 1,
      history: [{ version: 1, date: new Date().toISOString().slice(0, 10), action: "Uploaded", by: buyer.name }],
    };
    uploadDocument(doc);
    toast({ variant: "success", title: "Document uploaded", description: "Your document has been submitted for verification." });
    setShowUpload(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">My Documents</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage and access all your documents in one place.</p>
        </div>
        <Button onClick={() => setShowUpload(true)}><Upload size={15} /> Upload Document</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Tabs tabs={TABS} value={tab} onChange={setTab} className="border-b-0" />
          {myDocs.length === 0 ? (
            <EmptyState title="No documents in this category" className="py-8" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="text-left text-xs uppercase text-neutral-400"><tr><th className="py-2">Document</th><th>Type</th><th>Status</th><th>Uploaded On</th><th>Action</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {myDocs.map((d) => (
                    <tr key={d.id}>
                      <td className="py-2.5 font-medium text-neutral-800">{d.name}</td>
                      <td>{d.category}</td>
                      <td>
                        <StatusBadge tone={docStatusTone(d.status)} dot={false}>{d.status}</StatusBadge>
                        {d.status === "Rejected" && d.rejectionReason && <p className="mt-1 max-w-xs text-xs text-status-sold">{d.rejectionReason}</p>}
                      </td>
                      <td>{formatDate(d.uploadDate)}</td>
                      <td><button onClick={() => toast({ variant: "success", title: "Document downloaded" })} className="text-brand-700 hover:underline"><Download size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex min-h-[238px] flex-col lg:col-span-1">
          <CardContent className="flex flex-1 flex-col p-5 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-available-bg text-status-available"><ShieldCheck size={20} /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-5 text-neutral-900">Your Documents are Secure</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">All uploaded documents are encrypted and stored securely.<br className="hidden xl:block" /> Only authorized personnel have access.</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <span className="flex items-center gap-1 rounded-full bg-status-available-bg px-2 py-1 text-xs font-medium text-status-available"><Lock size={11} /> 256-bit Encryption</span>
            </div>
          </CardContent>
        </Card>
        <Card className="flex min-h-[238px] flex-col">
          <CardHeader className="pb-3"><CardTitle>Missing / Requested Documents</CardTitle></CardHeader>
          <CardContent className="flex flex-1 flex-col">
            {MISSING_DOCS.length === 0 ? (
              <EmptyState title="No documents pending" className="py-4" />
            ) : (
              <ul className="flex flex-col gap-2">
                {MISSING_DOCS.map((m) => (
                  <li key={m} className="flex items-center gap-2 rounded-lg bg-status-booked-bg p-2.5 text-sm text-status-booked">
                    <FileWarning size={15} /> {m}
                  </li>
                ))}
              </ul>
            )}
            <Button size="sm" variant="secondary" className="mt-auto w-fit" onClick={() => setShowUpload(true)}>Upload Now</Button>
          </CardContent>
        </Card>
        <Card className="flex min-h-[238px] flex-col">
          <CardHeader className="pb-3"><CardTitle>Registration Details</CardTitle></CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center gap-1.5 text-sm">
            <RowItem label="Plot No." value={plot.plotNo} />
            <RowItem label="Plot Size" value={`${plot.areaSqYd} sq yd`} />
            <RowItem label="Block" value={plot.block} />
          </CardContent>
        </Card>
      </div>

      <RmContactBand rmId={buyer.assignedRmId} />

      <Modal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload Document"
        description="Upload your document securely. Supported formats: PDF, JPG, PNG (Max 10MB)."
        footer={<><Button variant="secondary" onClick={() => setShowUpload(false)}>Cancel</Button><Button onClick={handleUpload}><Upload size={15} /> Upload</Button></>}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-surface-subtle p-8 text-center">
            <Upload size={22} className="text-neutral-400" />
            <p className="text-sm text-neutral-500">Drag and drop a file, or click to browse</p>
          </div>
          <Select label="Document Category" defaultValue="Financial">
            {(["KYC", "Financial", "Property", "Legal"] as DocumentCategory[]).map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
      </Modal>
    </div>
  );
}

function RowItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 py-1.5 last:border-0">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium text-neutral-800">{value}</span>
    </div>
  );
}
