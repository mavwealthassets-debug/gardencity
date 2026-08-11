import { useMemo, useState, type ReactNode } from "react";
import { ClipboardCheck, FileText, Landmark, MapPinned, Search, User, Wallet, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/common/Modal";
import { useAppData } from "@/app/store";
import { bookings, loans, registrationMilestones } from "@/data";

function ResultSection({ title, children }: { title: string; children: ReactNode }) {
  return <div className="mb-2"><p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">{title}</p>{children}</div>;
}

function ResultButton({ icon, text, onClick }: { icon: ReactNode; text: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-surface-subtle">{icon}<span className="truncate text-sm text-neutral-800">{text}</span></button>;
}

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { plots, buyers, transactions, documents } = useAppData();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { plots: [], buyers: [], payments: [], documents: [], bookings: [], loans: [], registrations: [] };
    return {
      plots: plots.filter((p) => p.plotNo.toLowerCase().includes(q) || p.block.toLowerCase().includes(q)).slice(0, 5),
      buyers: buyers.filter((b) => b.name.toLowerCase().includes(q) || b.phone.includes(q) || b.email.toLowerCase().includes(q)).slice(0, 5),
      payments: transactions.filter((t) => t.referenceNo.toLowerCase().includes(q) || t.plotId.toLowerCase().includes(q)).slice(0, 4),
      documents: documents.filter((d) => d.name.toLowerCase().includes(q) || (d.plotId ?? "").toLowerCase().includes(q)).slice(0, 4),
      bookings: bookings.filter((b) => b.id.toLowerCase().includes(q) || b.plotId.toLowerCase().includes(q)).slice(0, 4),
      loans: loans.filter((l) => l.loanAccountNo.toLowerCase().includes(q) || l.accountHolder.toLowerCase().includes(q)).slice(0, 4),
      registrations: registrationMilestones.filter((r) => r.id.toLowerCase().includes(q) || r.step.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [query, plots, buyers, transactions, documents]);

  function go(path: string) { onClose(); setQuery(""); navigate(path); }
  const noResults = query.trim() && Object.values(results).every((items) => items.length === 0);
  const iconClass = "shrink-0 text-brand-700";

  return (
    <Modal open={open} onClose={onClose} title="" size="lg">
      <div className="relative -m-5 mb-0 border-b border-border">
        <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search buyers, plots, bookings, payments or documents..." aria-label="Global search" className="h-14 w-full border-0 bg-transparent pl-12 pr-12 text-base text-neutral-900 outline-none placeholder:text-neutral-400" />
        {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear" className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"><X size={16} /></button>}
      </div>
      <div className="-mx-5 -mb-5 max-h-[420px] overflow-y-auto px-2 py-2">
        {!query.trim() && <p className="px-3 py-6 text-center text-sm text-neutral-400">Search across existing CRM records. Press Esc to close.</p>}
        {noResults && <p className="px-3 py-6 text-center text-sm text-neutral-400">No results for “{query}”.</p>}
        {!!results.plots.length && <ResultSection title="Plots">{results.plots.map((p) => <ResultButton key={p.id} icon={<MapPinned size={16} className={iconClass} />} text={`${p.plotNo} — Block ${p.block}, ${p.areaSqYd} sq yd`} onClick={() => go("/admin/plot-inventory")} />)}</ResultSection>}
        {!!results.buyers.length && <ResultSection title="Buyers">{results.buyers.map((b) => <ResultButton key={b.id} icon={<User size={16} className={iconClass} />} text={`${b.name} — ${b.phone} · ${b.email}`} onClick={() => go(`/admin/buyers/${b.id}`)} />)}</ResultSection>}
        {!!results.payments.length && <ResultSection title="Payments">{results.payments.map((item) => <ResultButton key={item.id} icon={<Wallet size={16} className={iconClass} />} text={`${item.referenceNo} — ${item.plotId}`} onClick={() => go("/admin/finance")} />)}</ResultSection>}
        {!!results.documents.length && <ResultSection title="Documents">{results.documents.map((item) => <ResultButton key={item.id} icon={<FileText size={16} className={iconClass} />} text={`${item.name} — ${item.plotId ?? "—"}`} onClick={() => go("/admin/documents")} />)}</ResultSection>}
        {!!results.bookings.length && <ResultSection title="Bookings">{results.bookings.map((item) => <ResultButton key={item.id} icon={<ClipboardCheck size={16} className={iconClass} />} text={`${item.id} — ${item.plotId}`} onClick={() => go("/admin/plot-inventory")} />)}</ResultSection>}
        {!!results.loans.length && <ResultSection title="Loans">{results.loans.map((item) => <ResultButton key={item.loanAccountNo} icon={<Landmark size={16} className={iconClass} />} text={`${item.loanAccountNo} — ${item.accountHolder}`} onClick={() => go("/admin/finance")} />)}</ResultSection>}
        {!!results.registrations.length && <ResultSection title="Registration">{results.registrations.map((item) => <ResultButton key={item.id} icon={<ClipboardCheck size={16} className={iconClass} />} text={`${item.step} — ${item.status}`} onClick={() => go(`/admin/buyers/${item.buyerId}`)} />)}</ResultSection>}
      </div>
    </Modal>
  );
}
