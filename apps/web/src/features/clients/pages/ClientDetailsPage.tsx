import { Chip, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/data-display/PageHeader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useClient } from '../hooks/useClients';

export function ClientDetailsPage() {
  const { id = '' } = useParams();
  const { data, isLoading, error } = useClient(id);
  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState />;
  return (
    <Stack spacing={2}>
      <PageHeader title="Client Details" subtitle="Profile and notes" />
      <Paper sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography>
            Name: {data.firstName} {data.lastName}
          </Typography>
          <Typography>Company: {data.companyName}</Typography>
          <Typography>Email: {data.email}</Typography>
          <Typography>Phone: {data.phone}</Typography>
          <Typography>Status: {data.status}</Typography>
          <Typography>Notes: {data.notes ?? '-'}</Typography>
          <Stack direction="row" spacing={1}>
            {data.tagLinks?.map((t: { id: string; tag: { name: string } }) => (
              <Chip key={t.id} label={t.tag.name} size="small" />
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
