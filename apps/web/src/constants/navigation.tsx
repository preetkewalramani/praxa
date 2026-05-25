import { type ReactNode } from 'react';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import BuildOutlined from '@mui/icons-material/BuildOutlined';
import WorkOutline from '@mui/icons-material/WorkOutline';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import AssessmentOutlined from '@mui/icons-material/AssessmentOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';

export interface NavItemDef {
  label: string;
  path: string;
  permissions?: string[];
  roles?: string[];
  icon: ReactNode;
}
export const NAV_ITEMS: NavItemDef[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
  { label: 'Clients', path: '/clients', icon: <GroupsOutlined /> },
  { label: 'Services', path: '/services', icon: <BuildOutlined /> },
  { label: 'Projects', path: '/projects', icon: <WorkOutline /> },
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
];
