import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useAuth } from '@/app/store/auth-context';
import { useThemeMode } from '@/app/providers/ThemeAppProvider';

export function AppHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar>
        <IconButton aria-label="open navigation" onClick={onToggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Typography sx={{ ml: 1 }} variant="h6">
          Praxa
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography sx={{ mr: 2 }} variant="body2">
          {user?.tenantName ?? 'Tenant'}
        </Typography>
        <IconButton aria-label="toggle theme" onClick={toggleTheme}>
          {mode === 'dark' ? '🌙' : '☀️'}
        </IconButton>
        <IconButton aria-label="notifications">
          <NotificationsNoneOutlined />
        </IconButton>
        <Typography sx={{ ml: 1 }} variant="body2">
          {user?.email ?? 'Guest'}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
