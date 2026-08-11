import { useState } from "react";
import { ArrowLeft, Download, Target, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Table, TableContainer, TBody, TD, TH, THead, TR } from "@/components/common/Table";
import { formatDate } from "@/lib/format";

export default function ConversionReportPage() {
  const navigate = useNavigate();
  const { buyers } = useAppData();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const filtered = buyers.filter((buyer) => `${buyer.name} ${buyer.email} ${buyer.source} ${buyer.status} ${buyer.plotId ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  const converted = buyers.filter((buyer) => buyer.plotId).length;
  const leads = buyers.filter((buyer) => buyer.status === "Lead").length;

  return <div className="px-4 pb-8 pt-6 sm:px-6"><div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
    <button type="button" onClick={() => navigate("/admin/reports")} className="flex w-fit items-center gap-2 text-xs font-medium text-neutral-500 hover:text-brand-700"><ArrowLeft size={14} /> Reports / Conversion Rate</button>
    <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Conversion Rate</p><div className="mt-1.5 flex items-end gap-3"><h1 className="text-3xl font-bold leading-none">18.6%</h1><span className="text-xs font-semibold text-brand-700">+2.4% vs Apr '25</span></div><p className="mt-3 text-sm text-neutral-500">Buyer lead-to-plot conversion performance and source details.</p></div>
    <div className="grid gap-3 sm:grid-cols-3"><Summary label="Buyer records" value={String(buyers.length)} icon={Users} /><Summary label="Converted buyers" value={String(converted)} icon={Target} /><Summary label="Open leads" value={String(leads)} icon={TrendingUp} /></div>
    <Card className="overflow-hidden"><CardContent className="p-5 sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><SearchInput value={query} onChange={setQuery} placeholder="Search buyers or lead source..." containerClassName="w-full sm:max-w-[400px]" /><Button variant="secondary" onClick={() => toast({ variant: "success", title: "Conversion report exported" })}><Download size={14} /> Export</Button></div>
      <TableContainer className="mt-5 shadow-none [&_th]:h-12 [&_th]:px-5 [&_td]:px-5 [&_td]:py-4"><Table><THead><TR><TH>Buyer</TH><TH>Contact</TH><TH>Lead Source</TH><TH>Purpose</TH><TH>Buyer Since</TH><TH>Plot</TH><TH>Status</TH><TH className="text-right">Action</TH></TR></THead><TBody>{filtered.map((buyer) => <TR key={buyer.id}><TD className="font-medium">{buyer.name}</TD><TD><p>{buyer.phone}</p><p className="text-xs text-neutral-400">{buyer.email}</p></TD><TD>{buyer.source}</TD><TD>{buyer.purpose}</TD><TD>{formatDate(buyer.buyerSince)}</TD><TD>{buyer.plotId ?? "—"}</TD><TD><StatusBadge tone={buyer.plotId ? "green" : buyer.status === "Lead" ? "blue" : "gray"} dot={false}>{buyer.plotId ? "Converted" : buyer.status}</StatusBadge></TD><TD className="text-right"><Button variant="link" size="sm" onClick={() => navigate(`/admin/buyers/${buyer.id}`)}>View</Button></TD></TR>)}</TBody></Table></TableContainer>
    </CardContent></Card>
  </div></div>;
}

function Summary({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Users }) {
  return <Card className="min-h-[88px]"><CardContent className="flex h-full items-center gap-4 px-5 py-4"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700"><Icon size={20} /></span><div><p className="text-sm text-neutral-500">{label}</p><p className="mt-0.5 text-2xl font-bold">{value}</p></div></CardContent></Card>;
}
