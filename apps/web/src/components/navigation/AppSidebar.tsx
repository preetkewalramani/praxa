import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { NAV_ITEMS } from '@/constants/navigation';
import { useAuth } from '@/app/store/auth-context';
import { NavGroup } from './NavGroup';

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const items = NAV_ITEMS.filter(
    (item) =>
      (!item.roles || item.roles.some((r) => user?.roles.includes(r))) &&
      (!item.permissions || item.permissions.every((p) => user?.permissions.includes(p))),
  );
  return (
    <Drawer variant={mobile ? 'temporary' : 'permanent'} open={open} onClose={onClose}>
      <Box sx={{ width: 280, pt: 2 }} role="navigation" aria-label="Application navigation">
        <NavGroup title="Main" items={items} onNavigate={onClose} />
      </Box>
    </Drawer>
  );
}
