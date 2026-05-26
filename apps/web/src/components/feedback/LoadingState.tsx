import { CircularProgress, Stack, Typography } from '@mui/material';
export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <Stack alignItems="center" spacing={1}>
      <CircularProgress size={24} />
      <Typography variant="body2">{label}</Typography>
    </Stack>
  );
}
