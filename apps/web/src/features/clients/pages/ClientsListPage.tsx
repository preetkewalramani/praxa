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
import { useArchiveClient, useClients, useRestoreClient } from '../hooks/useClients';

export function ClientsListPage() {
  const [search, setSearch] = useState('');
  const { notify } = useSnackbar();
  const { data, isLoading, error } = useClients({ search });
  const archive = useArchiveClient();
  const restore = useRestoreClient();
  const rows = data?.items ?? [];

  return (
    <Stack spacing={2}>
      <PageHeader title="Clients" subtitle="Client management" />
      <TextField
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, company, phone"
        aria-label="Search clients"
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
                <TableCell>Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(
                (c: {
                  id: string;
                  firstName: string;
                  lastName: string;
                  companyName: string;
                  email: string;
                  phone: string;
                  status: string;
                  createdAt: string;
                  deletedAt?: string | null;
                  tagLinks?: Array<{ id: string; tag: { name: string; color: string } }>;
                }) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      {c.firstName} {c.lastName}
                    </TableCell>
                    <TableCell>{c.companyName}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>
                      <Chip size="small" label={c.status} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {c.tagLinks?.map((t) => (
                          <Chip
                            key={t.id}
                            label={t.tag.name}
                            size="small"
                            sx={{ bgcolor: t.tag.color, color: '#fff' }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={() =>
                            archive.mutate(c.id, {
                              onSuccess: () => notify('Client archived', 'warning'),
                            })
                          }
                        >
                          Archive
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            restore.mutate(c.id, {
                              onSuccess: () => notify('Client restored', 'success'),
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
