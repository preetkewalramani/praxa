import { type ReactNode } from 'react';
import { AdministrationPage } from '@/pages/system/AdministrationPage';
import { ClientsPage } from '@/pages/dashboard/ClientsPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { InvoicesPage } from '@/pages/dashboard/InvoicesPage';
import { ProjectsPage } from '@/pages/dashboard/ProjectsPage';
import { ReportsPage } from '@/pages/dashboard/ReportsPage';
import { ServicesPage } from '@/pages/dashboard/ServicesPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';

export interface AppRouteDefinition {
  path: string;
  element: ReactNode;
  requiresAuth: boolean;
  permissions?: string[];
  roles?: string[];
}
export const appRoutes: AppRouteDefinition[] = [
  { path: '/', element: <DashboardPage />, requiresAuth: true },
  { path: '/clients', element: <ClientsPage />, requiresAuth: true },
  { path: '/services', element: <ServicesPage />, requiresAuth: true },
  { path: '/projects', element: <ProjectsPage />, requiresAuth: true },
  { path: '/invoices', element: <InvoicesPage />, requiresAuth: true },
  { path: '/reports', element: <ReportsPage />, requiresAuth: true },
  {
    path: '/settings',
    element: <SettingsPage />,
    requiresAuth: true,
    permissions: ['settings.read'],
  },
  {
    path: '/administration',
    element: <AdministrationPage />,
    requiresAuth: true,
    roles: ['SUPER_ADMIN', 'FIRM_ADMIN'],
  },
];
