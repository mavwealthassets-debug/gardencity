import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, Sparkles, Gift } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { SearchInput } from "@/components/common/SearchInput";
import { Select } from "@/components/common/Field";
import { Button } from "@/components/common/Button";
import { TableContainer, Table, THead, TBody, TR, TH, TD } from "@/components/common/Table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { Avatar } from "@/components/common/Avatar";
import { useAppData } from "@/app/store";
import { relationshipManagers } from "@/data/users";
import { formatDate } from "@/lib/format";

const PAGE_SIZE = 10;

export default function BuyersListPage() {
  const { buyers, plots } = useAppData();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rmFilter, setRmFilter] = useState("all");
  const [page, setPage] = useState(1);

  const stats = useMemo(
    () => ({
      total: buyers.length,
      active: buyers.filter((b) => b.status === "Active").length,
      converted: plots.filter((p) => p.status === "sold").length,
      leads: buyers.filter((b) => b.status === "Lead").length,
    }),
    [buyers, plots]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return buyers.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (rmFilter !== "all" && b.assignedRmId !== rmFilter) return false;
      if (!q) return true;
      return b.name.toLowerCase().includes(q) || b.phone.includes(q) || (b.plotId ?? "").toLowerCase().includes(q);
    });
  }, [buyers, query, statusFilter, rmFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-5 pb-10">
      <PageHeader title="Buyers" description="Manage buyer relationships across the sales lifecycle." />
      <div className="flex flex-col gap-5 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="Total Buyers" value={String(stats.total)} icon={Users} iconTone="blue" />
          <MetricCard label="Active Buyers" value={String(stats.active)} icon={UserCheck} iconTone="green" />
          <MetricCard label="Converted Buyers" value={String(stats.converted)} icon={Sparkles} iconTone="teal" />
          <MetricCard label="Warm Leads" value={String(stats.leads)} icon={Gift} iconTone="orange" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search by name, phone or plot..." containerClassName="sm:w-72" />
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="sm:w-40" aria-label="Filter by status">
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Lead">Lead</option>
            <option value="Inactive">Inactive</option>
          </Select>
          <Select value={rmFilter} onChange={(e) => { setRmFilter(e.target.value); setPage(1); }} className="sm:w-52" aria-label="Filter by relationship manager">
            <option value="all">All Relationship Managers</option>
            {relationshipManagers.map((rm) => <option key={rm.id} value={rm.id}>{rm.name}</option>)}
          </Select>
        </div>

        <TableContainer>
          <Table>
            <THead>
              <TR>
                <TH>Buyer</TH>
                <TH>Contact</TH>
                <TH>Plot</TH>
                <TH>Status</TH>
                <TH>KYC</TH>
                <TH>Registration</TH>
                <TH>Relationship Manager</TH>
                <TH>Buyer Since</TH>
              </TR>
            </THead>
            <TBody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState title="No buyers found" description="Try a different search term or filter." action={<Button variant="secondary" size="sm" onClick={() => { setQuery(""); setStatusFilter("all"); setRmFilter("all"); }}>Clear filters</Button>} />
                  </td>
                </tr>
              ) : (
                pageItems.map((b) => {
                  const rm = relationshipManagers.find((r) => r.id === b.assignedRmId);
                  return (
                    <TR key={b.id} className="cursor-pointer" onClick={() => navigate(`/admin/buyers/${b.id}`)}>
                      <TD>
                        <span className="flex items-center gap-2.5">
                          <Avatar name={b.name} size="sm" />
                          <span className="font-semibold text-neutral-900">{b.name}</span>
                        </span>
                      </TD>
                      <TD>
                        <span className="block">{b.phone}</span>
                        <span className="block text-xs text-neutral-400">{b.email}</span>
                      </TD>
                      <TD>{b.plotId ?? "—"}</TD>
                      <TD><StatusBadge tone={b.status === "Active" ? "green" : b.status === "Lead" ? "orange" : "gray"}>{b.status}</StatusBadge></TD>
                      <TD><StatusBadge tone={b.kycStatus === "Verified" ? "green" : b.kycStatus === "Pending" ? "orange" : "red"} dot={false}>{b.kycStatus}</StatusBadge></TD>
                      <TD>{b.registrationStatus}</TD>
                      <TD>{rm?.name ?? "—"}</TD>
                      <TD>{formatDate(b.buyerSince)}</TD>
                    </TR>
                  );
                })
              )}
            </TBody>
          </Table>
          {pageItems.length > 0 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />}
        </TableContainer>
      </div>
    </div>
  );
}
