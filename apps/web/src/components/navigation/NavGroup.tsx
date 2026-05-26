import { List, Typography } from '@mui/material';
import { type NavItemDef } from '@/constants/navigation';
import { NavItem } from './NavItem';

export function NavGroup({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: NavItemDef[];
  onNavigate?: () => void;
}) {
  return (
    <>
      <Typography sx={{ px: 2, py: 1 }} variant="caption">
        {title}
      </Typography>
      <List>
        {items.map((i) => (
          <NavItem item={i} key={i.path} onClick={onNavigate} />
        ))}
      </List>
    </>
  );
}
