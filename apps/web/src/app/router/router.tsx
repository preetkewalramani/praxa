import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthGuard } from '@/app/guards/AuthGuard';
import { PermissionGuard } from '@/app/guards/PermissionGuard';
import { RoleGuard } from '@/app/guards/RoleGuard';
import { RouteErrorBoundary } from '@/components/feedback/RouteErrorBoundary';
import { appRoutes } from './route-definitions';

export const router = createBrowserRouter([
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        errorElement: <RouteErrorBoundary />,
        children: appRoutes.map((r) => ({
          path: r.path,
          element: (
            <RoleGuard roles={r.roles}>
              <PermissionGuard permissions={r.permissions}>
                <>{r.element}</>
              </PermissionGuard>
            </RoleGuard>
          ),
        })),
      },
    ],
  },
  { path: '/auth/login', element: <div>Login placeholder</div> },
  { path: '/system/forbidden', element: <div>Forbidden</div> },
  { path: '*', element: <div>Not Found</div> },
]);
