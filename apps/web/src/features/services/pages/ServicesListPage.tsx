import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useSnackbar } from '@/app/providers/SnackbarProvider';
import { PageHeader } from '@/components/data-display/PageHeader';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useArchiveService, useRestoreService, useServices } from '../hooks/useServices';

export function ServicesListPage() {
  const [search, setSearch] = useState('');
  const { notify } = useSnackbar();
  const { data, isLoading, error } = useServices({ search });
  const archive = useArchiveService();
  const restore = useRestoreService();
  const rows = data?.items ?? [];

  return (
    <Stack spacing={2}>
      <PageHeader title="Services" subtitle="Service catalog and pricing" />
      <TextField
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by code, name, description"
        aria-label="Search services"
      />
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Current Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(
                (s: {
                  id: string;
                  code: string;
                  name: string;
                  category?: { name: string };
                  prices?: Array<{ amount: string; currency: string }>;
                  status: string;
                  defaultDurationMinutes: number;
                  createdAt: string;
                }) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.code}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.category?.name ?? '-'}</TableCell>
                    <TableCell>
                      {s.prices?.[0] ? `${s.prices[0].amount} ${s.prices[0].currency}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={s.status} />
                    </TableCell>
                    <TableCell>{s.defaultDurationMinutes} min</TableCell>
                    <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={() =>
                            archive.mutate(s.id, {
                              onSuccess: () => notify('Service archived', 'warning'),
                            })
                          }
                        >
                          Archive
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            restore.mutate(s.id, {
                              onSuccess: () => notify('Service restored', 'success'),
                            })
                          }
                        >
                          Restore
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
}
