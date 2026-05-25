import {
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { PageHeader } from '@/components/data-display/PageHeader';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useWorkOrders } from '../hooks/useProjects';

export function WorkOrdersPage() {
  const { data, isLoading, error } = useWorkOrders();
  const rows = data ?? [];
  return (
    <Stack spacing={2}>
      <PageHeader title="Work Orders" subtitle="Execution workflow" />
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
                <TableCell>Title</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(
                (w: {
                  id: string;
                  code: string;
                  title: string;
                  project?: { name: string };
                  status: string;
                  priority: string;
                  assignedTo?: string | null;
                  dueDate?: string | null;
                }) => (
                  <TableRow key={w.id}>
                    <TableCell>{w.code}</TableCell>
                    <TableCell>{w.title}</TableCell>
                    <TableCell>{w.project?.name ?? '-'}</TableCell>
                    <TableCell>
                      <Chip size="small" label={w.status} />
                    </TableCell>
                    <TableCell>{w.priority}</TableCell>
                    <TableCell>{w.assignedTo ?? '-'}</TableCell>
                    <TableCell>
                      {w.dueDate ? new Date(w.dueDate).toLocaleDateString() : '-'}
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
