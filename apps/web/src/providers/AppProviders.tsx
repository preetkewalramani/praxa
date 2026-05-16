import { QueryClientProvider } from '@tanstack/react-query';
import { type JSX, type ReactNode } from 'react';

import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { queryClient } from '@/lib/query-client';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppErrorBoundary>
  );
}
