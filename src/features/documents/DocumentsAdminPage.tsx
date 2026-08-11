import { useMemo, useState } from "react";
import { Clock, ShieldCheck, XCircle, CalendarClock, Upload, Eye, Check, Send, X as XIcon, MoreVertical, Download, History, Replace } from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import { SearchInput } from "@/components/common/SearchInput";
import { Textarea, Select as FormSelect } from "@/components/common/Field";
import { Button } from "@/components/common/Button";
import { Tabs } from "@/components/common/Tabs";
import { TableContainer, Table, THead, TBody, TR, TH, TD } from "@/components/common/Table";
import { StatusBadge, docStatusTone } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { Drawer } from "@/components/common/Drawer";
import { Modal } from "@/components/common/Modal";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDate } from "@/lib/format";
import { getBuyerById } from "@/data/buyers";
import type { DocumentCategory, DocumentItem } from "@/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/common/Dropdown";
import { downloadTextPdf } from "@/lib/download";

const CATEGORY_TABS = [
  { value: "all", label: "All Documents" },
  { value: "KYC", label: "KYC" },
  { value: "Financial", label: "Financial" },
  { value: "Property", label: "Property" },
  { value: "Legal", label: "Legal" },
];
const PAGE_SIZE = 8;

export default function DocumentsAdminPage() {
  const { documents, verifyDocument, rejectDocument, requestDocumentResubmission, uploadDocument } = useAppData();
  const { toast } = useToast();

  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<DocumentItem | null>(() => documents.find((d) => d.status === "Pending") ?? documents[0] ?? null);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>("Property");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const stats = useMemo(
    () => ({
      pending: documents.filter((d) => d.status === "Pending").length,
      verified: documents.filter((d) => d.status === "Verified").length,
      rejected: documents.filter((d) => d.status === "Rejected").length,
      resubmission: documents.filter((d) => d.status === "Resubmission Required").length,
    }),
    [documents]
  );

  const counts = useMemo(
    () => ({
      all: documents.length,
      KYC: documents.filter((d) => d.category === "KYC").length,
      Financial: documents.filter((d) => d.category === "Financial").length,
      Property: documents.filter((d) => d.category === "Property").length,
      Legal: documents.filter((d) => d.category === "Legal").length,
    }),
    [documents]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents
      .filter((d) => category === "all" || d.category === category)
      .filter((d) => statusFilter === "all" || d.status === statusFilter)
      .filter((d) => {
        if (!q) return true;
        const buyer = getBuyerById(d.buyerId)?.name.toLowerCase() ?? "";
        return d.name.toLowerCase().includes(q) || buyer.includes(q) || (d.plotId ?? "").toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }, [documents, category, statusFilter, query]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedDocuments = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleVerify(doc: DocumentItem) {
    verifyDocument(doc.id, "Admin User");
    toast({ variant: "success", title: "Document verified", description: `${doc.name} has been marked as verified.` });
    setActive(null);
  }
  function handleReject() {
    if (!active) return;
    rejectDocument(active.id, "Admin User", rejectReason || "Document did not meet verification requirements.");
    toast({ variant: "warning", title: "Document rejected", description: `${active.name} has been rejected with a reason.` });
    setShowReject(false);
    setActive(null);
    setRejectReason("");
  }
  function handleResubmissionRequest() {
    if (!active) return;
    requestDocumentResubmission(active.id, "Admin User");
    toast({ variant: "success", title: "Resubmission request sent", description: `${active.name}: the buyer has been notified to upload a corrected document.` });
    setActive(null);
  }
  function selectUploadFile(file?: File) {
    if (!file) return;
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast({ variant: "error", title: "Unsupported file", description: "Select a PDF, JPG, or PNG file." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: "error", title: "File is too large", description: "The maximum upload size is 10MB." });
      return;
    }
    setUploadFile(file);
  }

  function closeUpload() {
    setShowUpload(false);
    setUploadFile(null);
    setUploadCategory("Property");
  }

  function handleUpload() {
    if (!uploadFile) {
      toast({ variant: "error", title: "Select a document", description: "Click the upload area and choose a file first." });
      return;
    }
    const doc: DocumentItem = {
      id: `doc-new-${Date.now()}`,
      buyerId: "buyer-rahul",
      plotId: "GCN-047",
      name: uploadFile.name,
      category: uploadCategory,
      status: "Pending",
      uploadedBy: "Admin User",
      uploadedByRole: "Administrator",
      uploadDate: new Date().toISOString().slice(0, 10),
      fileSizeKb: Math.max(1, Math.round(uploadFile.size / 1024)),
      fileType: uploadFile.type === "application/pdf" ? "PDF" : uploadFile.type === "image/png" ? "PNG" : "JPG",
      version: 1,
      history: [{ version: 1, date: new Date().toISOString().slice(0, 10), action: "Uploaded", by: "Admin User" }],
    };
    uploadDocument(doc);
    toast({ variant: "success", title: "Document uploaded", description: "The document has been added and is pending verification." });
    closeUpload();
  }

  function filterFromMetric(status: string) {
    setStatusFilter(status);
    setCategory("all");
    setQuery("");
    setPage(1);
  }

  function downloadSummary(doc: DocumentItem) {
    const buyer = getBuyerById(doc.buyerId);
    downloadTextPdf(`${doc.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-summary.pdf`, `${doc.name} Summary`, [
      `Buyer: ${buyer?.name ?? "—"}`, `Plot: ${doc.plotId ?? "—"}`, `Category: ${doc.category}`, `Status: ${doc.status}`,
      `Uploaded: ${formatDate(doc.uploadDate)}`, `Uploaded by: ${doc.uploadedBy}`, `Version: ${doc.version}`,
      `Verified by: ${doc.verifiedBy ?? "—"}`, `Rejection reason: ${doc.rejectionReason ?? "—"}`,
    ]);
    toast({ variant: "success", title: "Summary downloaded", description: `${doc.name} summary saved as PDF.` });
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:px-6">
      <div><h1 className="text-lg font-bold text-neutral-900">Documents</h1><p className="text-xs text-neutral-500">Manage and verify buyer KYC, financial, property and legal documents.</p></div>
      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_330px]">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MetricCard className={`h-[104px] ${statusFilter === "Pending" ? "ring-2 ring-status-booked" : ""}`} label="Pending Verification" value={String(stats.pending)} icon={Clock} iconTone="orange" sublabel={`${((stats.pending / documents.length) * 100).toFixed(0)}% of total documents`} progressPercent={(stats.pending / documents.length) * 100} onClick={() => filterFromMetric("Pending")} />
          <MetricCard className={`h-[104px] ${statusFilter === "Verified" ? "ring-2 ring-status-available" : ""}`} label="Verified" value={String(stats.verified)} icon={ShieldCheck} iconTone="green" sublabel={`${((stats.verified / documents.length) * 100).toFixed(0)}% of total documents`} progressPercent={(stats.verified / documents.length) * 100} onClick={() => filterFromMetric("Verified")} />
          <MetricCard className={`h-[104px] ${statusFilter === "Rejected" ? "ring-2 ring-status-sold" : ""}`} label="Rejected" value={String(stats.rejected)} icon={XCircle} iconTone="red" sublabel={`${((stats.rejected / documents.length) * 100).toFixed(0)}% of total documents`} progressPercent={(stats.rejected / documents.length) * 100} onClick={() => filterFromMetric("Rejected")} />
          <MetricCard className={`h-[104px] ${statusFilter === "Resubmission Required" ? "ring-2 ring-status-booked" : ""}`} label="Expiring Soon (30 days)" value={String(stats.resubmission)} icon={CalendarClock} iconTone="orange" sublabel={`${((stats.resubmission / documents.length) * 100).toFixed(0)}% of total documents`} progressPercent={(stats.resubmission / documents.length) * 100} onClick={() => filterFromMetric("Resubmission Required")} />
        </div>

        <Tabs tabs={CATEGORY_TABS.map((t) => ({ ...t, count: counts[t.value as keyof typeof counts] }))} value={category} onChange={(value) => { setCategory(value); setPage(1); }} />

        <div className="flex items-center justify-end gap-2">
          <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search by buyer, plot or document..." containerClassName="mr-auto w-64" className="h-9 text-xs" />
          <div className="relative">
            <Button variant="secondary" size="sm" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters}>Filters</Button>
            {showFilters && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-56 overflow-hidden rounded-xl border border-border bg-white py-1.5 shadow-popover">
                {[
                  ["all", "All Statuses"],
                  ["Verified", "Verified"],
                  ["Pending", "Pending"],
                  ["Rejected", "Rejected"],
                  ["Resubmission Required", "Resubmission Required"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setStatusFilter(value); setPage(1); setShowFilters(false); }}
                    className={`flex w-full items-center px-3 py-2 text-left text-sm hover:bg-surface-muted ${statusFilter === value ? "bg-emerald-50 font-semibold text-primary" : "text-neutral-700"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button size="sm" onClick={() => setShowUpload(true)}><Upload size={14} /> Upload Document</Button>
        </div>

        <TableContainer>
          <Table className="text-xs">
            <THead>
              <TR>
                <TH>Buyer</TH>
                <TH>Plot</TH>
                <TH>Document</TH>
                <TH>Category</TH>
                <TH>Uploaded By</TH>
                <TH>Upload Date</TH>
                <TH>Status</TH>
                <TH className="w-24">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><EmptyState title="No documents found" description="Try a different search or filter." /></td></tr>
              ) : (
                pagedDocuments.map((d) => {
                  const buyer = getBuyerById(d.buyerId);
                  return (
                    <TR key={d.id} className="h-[44px] cursor-pointer" onClick={() => setActive(d)}>
                      <TD className="font-medium text-neutral-900">{buyer?.name ?? "—"}</TD>
                      <TD>{d.plotId ?? "—"}</TD>
                      <TD>{d.name}</TD>
                      <TD>{d.category}</TD>
                      <TD>{d.uploadedBy}</TD>
                      <TD>{formatDate(d.uploadDate)}</TD>
                      <TD><span title={d.status === "Pending" ? "Awaiting admin verification" : d.status === "Verified" ? `Verified by ${d.verifiedBy ?? "Admin User"}` : d.rejectionReason ?? d.status}><StatusBadge tone={docStatusTone(d.status)} dot={false}>{d.status}</StatusBadge></span></TD>
                      <TD onClick={(e) => e.stopPropagation()}>
                        <Dropdown trigger={({ onClick }) => <button type="button" onClick={onClick} aria-label={`Actions for ${d.name}`} className="rounded p-1.5 text-neutral-400 hover:bg-surface-muted hover:text-neutral-700"><MoreVertical size={15} /></button>}>
                          <DropdownItem onClick={() => setActive(d)}><Eye size={14} /> Preview</DropdownItem>
                          <DropdownItem onClick={() => toast({ variant: "warning", title: "Original unavailable", description: "This demo record does not include a stored original file." })}><Download size={14} /> Download Original</DropdownItem>
                          <DropdownItem onClick={() => downloadSummary(d)}><Download size={14} /> Download Summary</DropdownItem>
                          <DropdownSeparator />
                          {d.status !== "Verified" && <DropdownItem onClick={() => handleVerify(d)}><Check size={14} /> Verify</DropdownItem>}
                          {d.status !== "Rejected" && <DropdownItem onClick={() => { setActive(d); setShowReject(true); }}><XCircle size={14} /> Reject</DropdownItem>}
                          <DropdownItem onClick={() => { setActive(d); setShowUpload(true); }}><Replace size={14} /> Replace</DropdownItem>
                          <DropdownItem onClick={() => setActive(d)}><History size={14} /> Version & Audit History</DropdownItem>
                        </Dropdown>
                      </TD>
                    </TR>
                  );
                })
              )}
            </TBody>
          </Table>
          {filtered.length > 0 && <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />}
        </TableContainer>
      </div>

      <aside className="sticky top-3 hidden h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-border bg-surface shadow-card lg:flex lg:flex-col">
        {active && <>
          <div className="flex items-center justify-between border-b border-border p-3"><div><p className="text-sm font-bold text-neutral-900">{active.name}</p><StatusBadge tone={docStatusTone(active.status)} dot={false}>{active.status}</StatusBadge></div><button type="button" onClick={() => setActive(null)} className="text-neutral-400"><XIcon size={16} /></button></div>
          <div className="flex flex-1 flex-col gap-3 p-3">
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-subtle text-xs text-neutral-400">Document preview — {active.fileType} · {(active.fileSizeKb / 1024).toFixed(1)} MB</div>
            <div><p className="mb-2 text-xs font-semibold text-neutral-800">Document Information</p><dl className="grid grid-cols-2 gap-2 text-xs"><div><dt className="text-neutral-400">Category</dt><dd>{active.category}</dd></div><div><dt className="text-neutral-400">Buyer</dt><dd>{getBuyerById(active.buyerId)?.name}</dd></div><div><dt className="text-neutral-400">Uploaded By</dt><dd>{active.uploadedBy}</dd></div><div><dt className="text-neutral-400">Upload Date</dt><dd>{formatDate(active.uploadDate)}</dd></div></dl></div>
            <div><p className="mb-2 text-xs font-semibold uppercase text-neutral-400">Version History</p>{active.history.map((h, i) => <p key={i} className="flex justify-between text-xs text-neutral-600"><span>v{h.version} · {h.action} by {h.by}</span><span>{formatDate(h.date)}</span></p>)}</div>
          </div>
          {(active.status === "Rejected" || active.status === "Resubmission Required") ? (
            <div className="border-t border-border p-3"><Button size="sm" className="w-full" onClick={handleResubmissionRequest}><Send size={14} /> {active.status === "Rejected" ? "Send Resubmission Request" : "Resend Notification"}</Button></div>
          ) : active.status !== "Verified" && <div className="flex gap-2 border-t border-border p-3"><Button variant="dangerOutline" size="sm" className="flex-1" onClick={() => setShowReject(true)}><XIcon size={14} /> Reject</Button><Button size="sm" className="flex-1" onClick={() => handleVerify(active)}><Check size={14} /> Verify</Button></div>}
        </>}
      </aside>
      </div>

      {!isDesktop && <Drawer
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.name ?? ""}
        subtitle={active && <StatusBadge tone={docStatusTone(active.status)} dot={false}>{active.status}</StatusBadge>}
        footer={
          active && (active.status === "Rejected" || active.status === "Resubmission Required") ? (
            <Button className="flex-1" onClick={handleResubmissionRequest}>
              <Send size={15} /> {active.status === "Rejected" ? "Send Resubmission Request" : "Resend Notification"}
            </Button>
          ) : active && active.status !== "Verified" ? (
            <>
              <Button variant="dangerOutline" className="flex-1" onClick={() => setShowReject(true)}>
                <XIcon size={15} /> Reject Document
              </Button>
              <Button className="flex-1" onClick={() => handleVerify(active)}>
                <Check size={15} /> Verify Document
              </Button>
            </>
          ) : undefined
        }
      >
        {active && (
          <div className="flex flex-col gap-5">
            <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-subtle text-sm text-neutral-400">
              Document preview — {active.fileType} · {(active.fileSizeKb / 1024).toFixed(1)} MB
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-neutral-400">Category</dt><dd className="font-medium text-neutral-800">{active.category}</dd></div>
              <div><dt className="text-xs text-neutral-400">Buyer</dt><dd className="font-medium text-neutral-800">{getBuyerById(active.buyerId)?.name}</dd></div>
              <div><dt className="text-xs text-neutral-400">Uploaded By</dt><dd className="font-medium text-neutral-800">{active.uploadedBy} ({active.uploadedByRole})</dd></div>
              <div><dt className="text-xs text-neutral-400">Upload Date</dt><dd className="font-medium text-neutral-800">{formatDate(active.uploadDate)}</dd></div>
              {active.verifiedBy && <div><dt className="text-xs text-neutral-400">Verified By</dt><dd className="font-medium text-neutral-800">{active.verifiedBy}</dd></div>}
            </dl>
            {active.rejectionReason && (
              <div className="rounded-lg bg-status-sold-bg p-3 text-sm text-status-sold">
                <p className="font-semibold">Rejection reason</p>
                <p className="mt-1">{active.rejectionReason}</p>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">Version History</p>
              <ul className="flex flex-col gap-2 text-sm">
                {active.history.map((h, i) => (
                  <li key={i} className="flex justify-between text-neutral-600">
                    <span>v{h.version} · {h.action} by {h.by}</span>
                    <span className="text-neutral-400">{formatDate(h.date)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Drawer>}

      <Modal
        open={showReject}
        onClose={() => setShowReject(false)}
        title="Reject Document"
        description={active ? `Provide a reason for rejecting ${active.name}. This will be visible to the buyer.` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowReject(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleReject}>Confirm Rejection</Button>
          </>
        }
      >
        <Textarea label="Rejection Reason" required value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Image is blurred, please re-upload a clear scan." rows={4} />
      </Modal>

      <Modal
        open={showUpload}
        onClose={closeUpload}
        title="Upload Document"
        description="Securely upload a document on behalf of a buyer. Supported formats: PDF, JPG, PNG (Max 10MB)."
        footer={
          <>
            <Button variant="secondary" onClick={closeUpload}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!uploadFile}><Upload size={15} /> Upload</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <label
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-surface-subtle p-8 text-center transition hover:border-primary hover:bg-emerald-50/40 focus-within:ring-2 focus-within:ring-primary"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => { event.preventDefault(); selectUploadFile(event.dataTransfer.files[0]); }}
          >
            <input className="sr-only" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(event) => selectUploadFile(event.target.files?.[0])} />
            <Upload size={22} className={uploadFile ? "text-primary" : "text-neutral-400"} />
            <p className="text-sm font-medium text-neutral-700">{uploadFile?.name ?? "Drag and drop a file, or click to browse"}</p>
            {uploadFile && <p className="text-xs text-neutral-500">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB · Click to replace</p>}
          </label>
          <FormSelect label="Category" value={uploadCategory} onChange={(event) => setUploadCategory(event.target.value as DocumentCategory)}>
            {(["KYC", "Financial", "Property", "Legal"] as DocumentCategory[]).map((c) => <option key={c} value={c}>{c}</option>)}
          </FormSelect>
        </div>
      </Modal>
    </div>
  );
}
