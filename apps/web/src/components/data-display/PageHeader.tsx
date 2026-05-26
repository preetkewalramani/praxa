import { Box, Typography } from '@mui/material';
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4">{title}</Typography>
      {subtitle ? (
        <Typography color="text.secondary" variant="body2">
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
