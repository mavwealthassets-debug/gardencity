import { Check, ChevronDown } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/common/Dropdown";
import { gardenCityProject } from "@/data/project";

const PROJECTS = [gardenCityProject.name];

export function ProjectSelector() {
  return (
    <Dropdown
      align="left"
      trigger={({ onClick, open }) => (
        <button
          type="button"
          onClick={onClick}
          aria-expanded={open}
          className="hidden items-center gap-2.5 rounded-[10px] border border-border-strong bg-surface px-3 py-1.5 text-left hover:bg-surface-muted md:flex"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-50 text-brand-700">🏡</span>
          <span className="leading-tight">
            <span className="block text-[11px] text-neutral-500">Project</span>
            <span className="block text-sm font-semibold text-neutral-800">{gardenCityProject.name}</span>
          </span>
          <ChevronDown size={14} className="ml-1 text-neutral-400" />
        </button>
      )}
    >
      {PROJECTS.map((p) => (
        <DropdownItem key={p} disabled={p !== gardenCityProject.name}>
          <span className="flex-1">{p}</span>
          {p === gardenCityProject.name && <Check size={15} className="text-brand-700" />}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
