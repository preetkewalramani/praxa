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
import { useArchiveProject, useProjects } from '../hooks/useProjects';

export function ProjectsListPage() {
  const [search, setSearch] = useState('');
  const { notify } = useSnackbar();
  const { data, isLoading, error } = useProjects({ search });
  const archive = useArchiveProject();
  const rows = data?.items ?? [];
  return (
    <Stack spacing={2}>
      <PageHeader title="Projects" subtitle="Operational workflow projects" />
      <TextField
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by code, name, description"
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
                <TableCell>Client</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Target End Date</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(
                (p: {
                  id: string;
                  code: string;
                  name: string;
                  client?: { firstName: string; lastName: string };
                  status: string;
                  services?: Array<{ id: string }>;
                  targetEndDate?: string | null;
                  createdAt: string;
                }) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      {p.client ? `${p.client.firstName} ${p.client.lastName}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={p.status} />
                    </TableCell>
                    <TableCell>{p.services?.length ?? 0}</TableCell>
                    <TableCell>
                      {p.targetEndDate ? new Date(p.targetEndDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() =>
                          archive.mutate(p.id, {
                            onSuccess: () => notify('Project archived', 'warning'),
                          })
                        }
                      >
                        Archive
                      </Button>
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
