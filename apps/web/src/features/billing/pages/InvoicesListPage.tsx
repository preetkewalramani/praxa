import { Button, Stack, Typography } from '@mui/material';
import { PageHeader } from '@/components/data-display/PageHeader';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useInvoices, useIssueInvoice } from '../hooks/useBilling';

export const InvoicesListPage = () => {
  const { data, isLoading } = useInvoices();
  const issueMutation = useIssueInvoice();

  if (isLoading) return <LoadingState message="Loading invoices..." />;

  return (
    <Stack spacing={2}>
      <PageHeader title="Invoices" subtitle="Manage billing lifecycle" />
      {(data ?? []).map((invoice) => (
        <Stack key={invoice.id} direction="row" justifyContent="space-between" alignItems="center">
          <Typography>{invoice.invoiceNumber} — {invoice.status} — Due {invoice.amountDue}</Typography>
          <Button size="small" onClick={() => issueMutation.mutate(invoice.id)} disabled={invoice.status !== 'DRAFT'}>Issue</Button>
        </Stack>
      ))}
    </Stack>
  );
};
