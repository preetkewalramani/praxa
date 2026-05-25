import { Box, Container } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppSidebar } from '@/components/navigation/AppSidebar';

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <Box sx={{ flexGrow: 1 }}>
        <AppHeader onToggleSidebar={() => setOpen((v) => !v)} />
        <Container sx={{ py: 3 }}>{children}</Container>
      </Box>
    </Box>
  );
}
