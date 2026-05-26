import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { type NavItemDef } from '@/constants/navigation';

export function NavItem({ item, onClick }: { item: NavItemDef; onClick?: () => void }) {
  return (
    <ListItemButton component={NavLink} to={item.path} onClick={onClick} aria-label={item.label}>
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItemButton>
  );
}
