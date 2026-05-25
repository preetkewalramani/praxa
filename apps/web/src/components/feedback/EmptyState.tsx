import { Typography } from '@mui/material';
export function EmptyState({ message = 'No data available.' }: { message?: string }) {
  return <Typography color="text.secondary">{message}</Typography>;
}
