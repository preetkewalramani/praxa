import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export interface AuthUser {
  id: string;
  tenantName: string;
  email: string;
  roles: string[];
  permissions: string[];
}
interface AuthCtx {
  user: AuthUser | null;
  isAuthenticated: boolean;
  logout: () => void;
}
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>({
    id: 'placeholder',
    tenantName: 'Praxa Tenant',
    email: 'user@praxa.local',
    roles: ['FIRM_ADMIN'],
    permissions: ['dashboard.read', 'settings.read'],
  });
  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, logout: () => setUser(null) }),
    [user],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Auth context missing');
  return c;
};
