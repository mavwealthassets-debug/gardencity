import { ChevronDown, LogOut, Settings, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/common/Dropdown";
import { Avatar } from "@/components/common/Avatar";
import type { SessionUser } from "@/types";

export function UserMenu({ user, onLogout, profilePath, settingsPath }: { user: SessionUser; onLogout: () => void; profilePath?: string; settingsPath?: string }) {
  const navigate = useNavigate();

  return (
    <Dropdown
      align="right"
      trigger={({ onClick, open }) => (
        <button
          type="button"
          onClick={onClick}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-surface-muted"
        >
          <Avatar name={user.name} size="sm" className="bg-brand-600 text-white" />
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-semibold text-neutral-800">{user.name}</span>
            <span className="block text-xs text-neutral-500">{user.title}</span>
          </span>
          <ChevronDown size={14} className="hidden text-neutral-400 sm:block" />
        </button>
      )}
    >
      {profilePath && (
        <DropdownItem onClick={() => navigate(profilePath)}>
          <UserCircle size={16} /> My Profile
        </DropdownItem>
      )}
      {settingsPath && (
        <DropdownItem onClick={() => navigate(settingsPath)}>
          <Settings size={16} /> Settings
        </DropdownItem>
      )}
      <DropdownSeparator />
      <DropdownItem onClick={onLogout} className="text-status-sold">
        <LogOut size={16} /> Log out
      </DropdownItem>
    </Dropdown>
  );
}
