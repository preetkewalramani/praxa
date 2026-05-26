import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/LoadingState';
import { PageHeader } from '@/components/data-display/PageHeader';
import { useInvoice } from '../hooks/useBilling';

export const InvoiceDetailsPage = () => {
  const { id = '' } = useParams();
  const { data, isLoading } = useInvoice(id);

  if (isLoading) return <LoadingState message="Loading invoice..." />;
  if (!data) return <Typography>Invoice not found.</Typography>;

  return (
    <Stack spacing={2}>
      <PageHeader title={data.invoiceNumber} subtitle={`Status: ${data.status}`} />
      <Typography>Client: {data.clientId}</Typography>
      <Typography>Project: {data.projectId ?? 'N/A'}</Typography>
      <Typography>Total: {data.totalAmount}</Typography>
      <Typography>Paid: {data.amountPaid}</Typography>
      <Typography>Due: {data.amountDue}</Typography>
    </Stack>
  );
};
