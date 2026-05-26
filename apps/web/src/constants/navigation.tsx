import AssessmentOutlined from '@mui/icons-material/AssessmentOutlined';
import BuildOutlined from '@mui/icons-material/BuildOutlined';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import WorkOutline from '@mui/icons-material/WorkOutline';
import { type ReactNode } from 'react';

export interface NavItemDef {
  icon: ReactNode;
  label: string;
  path: string;
  permissions?: string[];
  roles?: string[];
}

export const NAV_ITEMS: NavItemDef[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
  { label: 'Clients', path: '/clients', icon: <GroupsOutlined /> },
  { label: 'Services', path: '/services', icon: <BuildOutlined /> },
  { label: 'Projects', path: '/projects', icon: <WorkOutline />, permissions: ['projects.read'] },
  {
    label: 'Work Orders',
    path: '/work-orders',
    icon: <AssignmentOutlined />,
    permissions: ['work-orders.read'],
  },
  { label: 'Invoices', path: '/invoices', icon: <ReceiptLongOutlined /> },
  { label: 'Reports', path: '/reports', icon: <AssessmentOutlined /> },
  {
    label: 'Settings',
    path: '/settings',
    icon: <SettingsOutlined />,
    permissions: ['settings.read'],
  },
  {
    label: 'Administration',
    path: '/administration',
    icon: <ShieldOutlined />,
    roles: ['SUPER_ADMIN', 'FIRM_ADMIN'],
  },
  {
    label: 'Admin Users',
    path: '/admin/users',
    icon: <ShieldOutlined />,
    permissions: ['users.read'],
  },
  {
    label: 'Admin Invitations',
    path: '/admin/invitations',
    icon: <ShieldOutlined />,
    permissions: ['invitations.read'],
  },
  {
    label: 'Admin Firm',
    path: '/admin/firm',
    icon: <ShieldOutlined />,
    permissions: ['firm.read'],
  },
];
