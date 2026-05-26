import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Paper, Stack, TextField } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { PageHeader } from '@/components/data-display/PageHeader';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useFirm, useUpdateFirm } from '../hooks/useAdministration';

const schema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function FirmSettingsPage() {
  const { data, isLoading } = useFirm();
  const update = useUpdateFirm();
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', logoUrl: '', timezone: 'UTC', currency: 'USD' },
  });
  useEffect(() => {
    if (data)
      reset({
        name: data.name ?? '',
        logoUrl: data.logoUrl ?? '',
        timezone: data.timezone ?? 'UTC',
        currency: data.currency ?? 'USD',
      });
  }, [data, reset]);
  if (isLoading) return <LoadingState />;
  return (
    <Stack spacing={2}>
      <PageHeader title="Firm Settings" subtitle="General and regional firm profile" />
      <Paper sx={{ p: 2 }}>
        <Stack
          component="form"
          spacing={2}
          onSubmit={handleSubmit((values) => update.mutate(values))}
        >
          {(['name', 'logoUrl', 'timezone', 'currency'] as const).map((name) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field }) => <TextField size="small" label={name} {...field} />}
            />
          ))}
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
