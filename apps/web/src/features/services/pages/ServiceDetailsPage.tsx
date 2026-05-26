import { zodResolver } from '@hookform/resolvers/zod';
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
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { PageHeader } from '@/components/data-display/PageHeader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { usePriceHistory, useService, useUpdatePrice } from '../hooks/useServices';

const schema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  effectiveFrom: z.string().min(1),
});
type PriceForm = z.infer<typeof schema>;

export function ServiceDetailsPage() {
  const { id = '' } = useParams();
  const { data, isLoading, error } = useService(id);
  const { data: prices = [] } = usePriceHistory(id);
  const updatePrice = useUpdatePrice();
  const [open, setOpen] = useState(false);
  const { control, handleSubmit } = useForm<PriceForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      currency: 'USD',
      effectiveFrom: new Date().toISOString().slice(0, 10),
    },
  });
  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState />;
  return (
    <Stack spacing={2}>
      <PageHeader title="Service Details" subtitle="Catalog profile and price history" />
      <Paper sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography>Code: {data.code}</Typography>
          <Typography>Name: {data.name}</Typography>
          <Typography>Category: {data.category?.name ?? '-'}</Typography>
          <Typography>Description: {data.description ?? '-'}</Typography>
          <Typography>Status: {data.status}</Typography>
          <Typography>Duration: {data.defaultDurationMinutes} min</Typography>
          <Typography>
            Current Price:{' '}
            {data.prices?.[0] ? `${data.prices[0].amount} ${data.prices[0].currency}` : '-'}
          </Typography>
          <Button variant="outlined" onClick={() => setOpen((v) => !v)}>
            {open ? 'Cancel Price Update' : 'Update Price'}
          </Button>
          {open ? (
            <Stack
              component="form"
              spacing={1}
              onSubmit={handleSubmit((values) => updatePrice.mutate({ id, payload: values }))}
            >
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <TextField
                    size="small"
                    label="Amount"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <Controller
                control={control}
                name="currency"
                render={({ field }) => <TextField size="small" label="Currency" {...field} />}
              />
              <Controller
                control={control}
                name="effectiveFrom"
                render={({ field }) => (
                  <TextField
                    size="small"
                    label="Effective From"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...field}
                  />
                )}
              />
              <Button type="submit" variant="contained">
                Save Price
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Effective From</TableCell>
              <TableCell>Effective To</TableCell>
              <TableCell>Current</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prices.map(
              (p: {
                id: string;
                amount: string;
                currency: string;
                effectiveFrom: string;
                effectiveTo?: string | null;
                isCurrent: boolean;
              }) => (
                <TableRow key={p.id}>
                  <TableCell>{p.amount}</TableCell>
                  <TableCell>{p.currency}</TableCell>
                  <TableCell>{new Date(p.effectiveFrom).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {p.effectiveTo ? new Date(p.effectiveTo).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{p.isCurrent ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
