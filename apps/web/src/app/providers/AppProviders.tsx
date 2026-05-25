import { type ReactNode } from 'react';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { AuthProvider } from '@/app/store/auth-context';
import { QueryProvider } from './QueryProvider';
import { SnackbarProvider } from './SnackbarProvider';
import { ThemeAppProvider } from './ThemeAppProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppErrorBoundary>
      <ThemeAppProvider>
        <SnackbarProvider>
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeAppProvider>
    </AppErrorBoundary>
  );
}
