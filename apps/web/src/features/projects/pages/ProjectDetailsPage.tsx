import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/data-display/PageHeader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useProject } from '../hooks/useProjects';

export function ProjectDetailsPage() {
  const { id = '' } = useParams();
  const { data, isLoading, error } = useProject(id);
  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState />;
  return (
    <Stack spacing={2}>
      <PageHeader title="Project Details" subtitle="Project, services, and work orders" />
      <Paper sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography>Code: {data.code}</Typography>
          <Typography>Name: {data.name}</Typography>
          <Typography>Status: {data.status}</Typography>
          <Typography>Description: {data.description ?? '-'}</Typography>
        </Stack>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.services?.map(
              (s: {
                id: string;
                service?: { name: string };
                quantity: number;
                unitPrice: string;
                totalPrice: string;
              }) => (
                <TableRow key={s.id}>
                  <TableCell>{s.service?.name ?? '-'}</TableCell>
                  <TableCell>{s.quantity}</TableCell>
                  <TableCell>{s.unitPrice}</TableCell>
                  <TableCell>{s.totalPrice}</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Assigned To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.workOrders?.map(
              (w: {
                id: string;
                code: string;
                title: string;
                status: string;
                priority: string;
                assignedTo?: string | null;
              }) => (
                <TableRow key={w.id}>
                  <TableCell>{w.code}</TableCell>
                  <TableCell>{w.title}</TableCell>
                  <TableCell>{w.status}</TableCell>
                  <TableCell>{w.priority}</TableCell>
                  <TableCell>{w.assignedTo ?? '-'}</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
