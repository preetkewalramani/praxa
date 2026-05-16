import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/layouts/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';

export const router = createBrowserRouter([
  {
    children: [
      {
        element: <DashboardPage />,
        index: true,
      },
    ],
    element: <AppLayout />,
    path: '/',
  },
]);
