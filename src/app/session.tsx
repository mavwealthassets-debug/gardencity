import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Role, SessionUser } from "@/types";
import { adminUser, buyerSessionUser } from "@/data/users";

interface SessionContextValue {
  user: SessionUser | null;
  login: (role: Role) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  const login = useCallback((role: Role) => {
    setUser(role === "admin" ? adminUser : buyerSessionUser);
  }, []);
  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
