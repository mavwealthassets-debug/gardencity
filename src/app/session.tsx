import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Role, SessionUser } from "@/types";
import { adminUser, buyerSessionUser } from "@/data/users";

interface SessionContextValue {
  user: SessionUser | null;
  login: (role: Role) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);
const SESSION_ROLE_KEY = "garden-city-session-role";

function getStoredUser(): SessionUser | null {
  const storedRole = window.localStorage.getItem(SESSION_ROLE_KEY);
  if (storedRole === "admin") return adminUser;
  if (storedRole === "buyer") return buyerSessionUser;
  return null;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(getStoredUser);

  const login = useCallback((role: Role) => {
    window.localStorage.setItem(SESSION_ROLE_KEY, role);
    setUser(role === "admin" ? adminUser : buyerSessionUser);
  }, []);
  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_ROLE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
