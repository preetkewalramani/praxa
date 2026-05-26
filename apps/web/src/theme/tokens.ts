export const colors = {
  light: {
    primary: '#2F6FED',
    secondary: '#6D5EF5',
    success: '#2E7D32',
    warning: '#ED6C02',
    error: '#D32F2F',
    info: '#0288D1',
    background: '#F6F8FB',
    surface: '#FFFFFF',
    border: '#DDE3ED',
    text: '#132238',
  },
  dark: {
    primary: '#88A8FF',
    secondary: '#A79BFF',
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#EF5350',
    info: '#4FC3F7',
    background: '#0F1722',
    surface: '#1A2433',
    border: '#2B3A50',
    text: '#E8EEF7',
  },
} as const;
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const shadows = [
  'none',
  '0px 1px 2px rgba(0,0,0,0.08)',
  '0px 2px 8px rgba(0,0,0,0.12)',
] as const;
export const zIndex = { appBar: 1100, drawer: 1200, modal: 1300, snackbar: 1400 } as const;
export const breakpoints = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } as const;
