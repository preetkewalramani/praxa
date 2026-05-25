import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth } from '@/app/store/auth-context';

export function PermissionGuard({
  permissions,
  children,
}: {
  permissions?: string[];
  children: ReactNode;
}) {
  const { user } = useAuth();
  if (!permissions || permissions.length === 0) return <>{children}</>;
  const ok = permissions.every((p) => user?.permissions.includes(p));
  return ok ? <>{children}</> : <Navigate to="/system/forbidden" replace />;
}
