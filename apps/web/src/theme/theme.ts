import { createTheme, type PaletteMode } from '@mui/material';
import { breakpoints, colors, spacing } from './tokens';

export const buildTheme = (mode: PaletteMode) => {
  const c = mode === 'dark' ? colors.dark : colors.light;
  return createTheme({
    palette: {
      mode,
      primary: { main: c.primary },
      secondary: { main: c.secondary },
      success: { main: c.success },
      warning: { main: c.warning },
      error: { main: c.error },
      info: { main: c.info },
      background: { default: c.background, paper: c.surface },
      text: { primary: c.text },
    },
    shape: { borderRadius: 10 },
    spacing: spacing.sm,
    breakpoints: { values: breakpoints },
    typography: {
      h1: { fontSize: '2.5rem' },
      h2: { fontSize: '2rem' },
      h3: { fontSize: '1.75rem' },
      h4: { fontSize: '1.5rem' },
      h5: { fontSize: '1.25rem' },
      h6: { fontSize: '1.1rem' },
      body1: { fontSize: '1rem' },
      body2: { fontSize: '0.875rem' },
      caption: { fontSize: '0.75rem' },
    },
  });
};
