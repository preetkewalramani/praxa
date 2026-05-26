import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth } from '@/app/store/auth-context';

export function RoleGuard({ roles, children }: { roles?: string[]; children: ReactNode }) {
  const { user } = useAuth();
  if (!roles || roles.length === 0) return <>{children}</>;
  const ok = roles.some((r) => user?.roles.includes(r));
  return ok ? <>{children}</> : <Navigate to="/system/forbidden" replace />;
}
