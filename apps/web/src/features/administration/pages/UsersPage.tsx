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
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useSnackbar } from '@/app/providers/SnackbarProvider';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { PageHeader } from '@/components/data-display/PageHeader';
import { useActivateUser, useDeactivateUser, useUsers } from '../hooks/useAdministration';

export function UsersPage() {
  const [search, setSearch] = useState('');
  const { notify } = useSnackbar();
  const { data, isLoading, error } = useUsers({ search });
  const activate = useActivateUser();
  const deactivate = useDeactivateUser();
  const users = useMemo(() => data?.items ?? [], [data]);

  return (
    <Stack spacing={2}>
      <PageHeader title="Users" subtitle="Firm user administration" />
      <TextField
        aria-label="Search users"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
      />
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : users.length === 0 ? (
        <EmptyState />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(
                (u: {
                  id: string;
                  firstName: string;
                  lastName: string;
                  email: string;
                  isActive: boolean;
                  createdAt: string;
                  userRoles?: Array<{ id: string; role: { name: string } }>;
                }) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      {u.firstName} {u.lastName}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {u.userRoles?.map((r: { id: string; role: { name: string } }) => (
                          <Chip key={r.id} label={r.role.name} size="small" />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={u.isActive ? 'Active' : 'Inactive'}
                        color={u.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={() =>
                            activate.mutate(u.id, {
                              onSuccess: () => notify('User activated', 'success'),
                            })
                          }
                        >
                          Activate
                        </Button>
                        <Button
                          size="small"
                          color="warning"
                          onClick={() =>
                            deactivate.mutate(u.id, {
                              onSuccess: () => notify('User deactivated', 'warning'),
                            })
                          }
                        >
                          Deactivate
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
      <Typography variant="caption" color="text.secondary">
        Total: {data?.total ?? 0}
      </Typography>
    </Stack>
  );
}
