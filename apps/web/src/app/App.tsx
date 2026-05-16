import { type JSX } from 'react';
import { RouterProvider } from 'react-router-dom';

import { AppProviders } from '@/providers/AppProviders';
import { router } from '@/routes/router';

export function App(): JSX.Element {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
