import { Alert, Snackbar } from '@mui/material';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Level = 'success' | 'warning' | 'error' | 'info';
interface SnackbarCtx {
  notify: (message: string, level?: Level) => void;
}
const Ctx = createContext<SnackbarCtx | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; message: string; level: Level }>({
    open: false,
    message: '',
    level: 'info',
  });
  const value = useMemo(
    () => ({
      notify: (message: string, level: Level = 'info') => setState({ open: true, message, level }),
    }),
    [],
  );
  return (
    <Ctx.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={3000}
        onClose={() => setState((s) => ({ ...s, open: false }))}
      >
        <Alert severity={state.level}>{state.message}</Alert>
      </Snackbar>
    </Ctx.Provider>
  );
}
export const useSnackbar = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Snackbar context missing');
  return c;
};
