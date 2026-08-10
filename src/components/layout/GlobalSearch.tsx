import { useMemo, useState } from "react";
import { Search, X, User, MapPinned } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/common/Modal";
import { plots } from "@/data/plots";
import { buyers } from "@/data/buyers";

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (query.trim().length < 1) return { plots: [], buyers: [] };
    const q = query.toLowerCase();
    return {
      plots: plots.filter((p) => p.plotNo.toLowerCase().includes(q) || p.block.toLowerCase().includes(q)).slice(0, 5),
      buyers: buyers.filter((b) => b.name.toLowerCase().includes(q) || b.phone.includes(q)).slice(0, 5),
    };
  }, [query]);

  function go(path: string) {
    onClose();
    setQuery("");
    navigate(path);
  }

  return (
    <Modal open={open} onClose={onClose} title="" size="lg">
      <div className="relative -m-5 mb-0 border-b border-border">
        <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search plots, buyers, phone numbers..."
          aria-label="Global search"
          className="h-14 w-full border-0 bg-transparent pl-12 pr-12 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear" className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
            <X size={16} />
          </button>
        )}
      </div>
      <div className="-mx-5 -mb-5 max-h-[420px] overflow-y-auto px-2 py-2">
        {query.trim().length < 1 && (
          <p className="px-3 py-6 text-center text-sm text-neutral-400">Start typing to search plots and buyers across the CRM.</p>
        )}
        {query.trim().length >= 1 && results.plots.length === 0 && results.buyers.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-neutral-400">No results for “{query}”.</p>
        )}
        {results.plots.length > 0 && (
          <div className="mb-2">
            <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">Plots</p>
            {results.plots.map((p) => (
              <button key={p.id} onClick={() => go("/admin/plot-inventory")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-surface-subtle">
                <MapPinned size={16} className="text-brand-700" />
                <span className="text-sm text-neutral-800">
                  Plot <span className="font-semibold">{p.plotNo}</span> — Block {p.block}, {p.areaSqYd} sq yd
                </span>
              </button>
            ))}
          </div>
        )}
        {results.buyers.length > 0 && (
          <div>
            <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">Buyers</p>
            {results.buyers.map((b) => (
              <button key={b.id} onClick={() => go(`/admin/buyers/${b.id}`)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-surface-subtle">
                <User size={16} className="text-brand-700" />
                <span className="text-sm text-neutral-800">
                  <span className="font-semibold">{b.name}</span> — {b.phone}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
