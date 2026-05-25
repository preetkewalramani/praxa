import {
  Button,
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
import { PageHeader } from '@/components/data-display/PageHeader';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import {
  useCreateInvitation,
  useInvitations,
  useRevokeInvitation,
} from '../hooks/useAdministration';

export function InvitationsPage() {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const { data, isLoading, error } = useInvitations();
  const create = useCreateInvitation();
  const revoke = useRevokeInvitation();
  const rows = data ?? [];
  return (
    <Stack spacing={2}>
      <PageHeader title="Invitations" subtitle="Invite users to your firm" />
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <TextField
          size="small"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          placeholder="Role ID"
        />
        <Button variant="contained" onClick={() => create.mutate({ email, roleId })}>
          Create
        </Button>
      </Stack>
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
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(
                (i: {
                  id: string;
                  email: string;
                  createdAt: string;
                  expiresAt: string;
                  acceptedAt?: string | null;
                  revokedAt?: string | null;
                  role?: { name: string };
                }) => (
                  <TableRow key={i.id}>
                    <TableCell>{i.email}</TableCell>
                    <TableCell>{i.role?.name ?? '-'}</TableCell>
                    <TableCell>{new Date(i.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(i.expiresAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {i.acceptedAt ? 'Accepted' : i.revokedAt ? 'Revoked' : 'Pending'}
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => revoke.mutate(i.id)}>
                        Revoke
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
