import { type ReactNode } from 'react';
import { ClientsListPage } from '@/features/clients/pages/ClientsListPage';
import { ClientDetailsPage } from '@/features/clients/pages/ClientDetailsPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { InvoicesListPage } from '@/features/billing/pages/InvoicesListPage';
import { InvoiceDetailsPage } from '@/features/billing/pages/InvoiceDetailsPage';
import { ProjectsListPage } from '@/features/projects/pages/ProjectsListPage';
import { ProjectDetailsPage } from '@/features/projects/pages/ProjectDetailsPage';
import { WorkOrdersPage } from '@/features/projects/pages/WorkOrdersPage';
import { ReportsPage } from '@/pages/dashboard/ReportsPage';
import { ServicesListPage } from '@/features/services/pages/ServicesListPage';
import { ServiceDetailsPage } from '@/features/services/pages/ServiceDetailsPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { AdministrationPage } from '@/pages/system/AdministrationPage';
import { FirmSettingsPage } from '@/features/administration/pages/FirmSettingsPage';
import { InvitationsPage } from '@/features/administration/pages/InvitationsPage';
import { UsersPage } from '@/features/administration/pages/UsersPage';

export interface AppRouteDefinition {
  path: string;
  element: ReactNode;
  requiresAuth: boolean;
  permissions?: string[];
  roles?: string[];
}
export const appRoutes: AppRouteDefinition[] = [
  { path: '/', element: <DashboardPage />, requiresAuth: true },
  {
    path: '/clients',
    element: <ClientsListPage />,
    requiresAuth: true,
    permissions: ['clients.read'],
  },
  {
    path: '/clients/:id',
    element: <ClientDetailsPage />,
    requiresAuth: true,
    permissions: ['clients.read'],
  },
  {
    path: '/services',
    element: <ServicesListPage />,
    requiresAuth: true,
    permissions: ['services.read'],
  },
  {
    path: '/services/:id',
    element: <ServiceDetailsPage />,
    requiresAuth: true,
    permissions: ['services.read'],
  },
  {
    path: '/projects',
    element: <ProjectsListPage />,
    requiresAuth: true,
    permissions: ['projects.read'],
  },
  {
    path: '/projects/:id',
    element: <ProjectDetailsPage />,
    requiresAuth: true,
    permissions: ['projects.read'],
  },
  {
    path: '/work-orders',
    element: <WorkOrdersPage />,
    requiresAuth: true,
    permissions: ['work-orders.read'],
  },
  { path: '/invoices', element: <InvoicesListPage />, requiresAuth: true, permissions: ['billing.read'] },
  { path: '/invoices/:id', element: <InvoiceDetailsPage />, requiresAuth: true, permissions: ['billing.read'] },
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
  { path: '/admin/users', element: <UsersPage />, requiresAuth: true, permissions: ['users.read'] },
  {
    path: '/admin/invitations',
    element: <InvitationsPage />,
    requiresAuth: true,
    permissions: ['invitations.read'],
  },
  {
    path: '/admin/firm',
    element: <FirmSettingsPage />,
    requiresAuth: true,
    permissions: ['firm.read'],
  },
];
