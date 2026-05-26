import { CssBaseline, ThemeProvider } from '@mui/material';
import { type PaletteMode } from '@mui/material';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildTheme } from '@/theme/theme';

interface ThemeCtx {
  mode: PaletteMode;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeCtx | null>(null);
const KEY = 'praxa-theme-mode';

export function ThemeAppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light');
  useEffect(() => {
    const stored = localStorage.getItem(KEY) as PaletteMode | null;
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
      return;
    }
    setMode(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);
  const toggleTheme = () =>
    setMode((p) => {
      const n = p === 'dark' ? 'light' : 'dark';
      localStorage.setItem(KEY, n);
      return n;
    });
  const value = useMemo(() => ({ mode, toggleTheme }), [mode]);
  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={buildTheme(mode)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
export const useThemeMode = () => {
  const c = useContext(ThemeContext);
  if (!c) throw new Error('Theme context missing');
  return c;
};
