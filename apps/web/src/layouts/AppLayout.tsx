import { type JSX } from 'react';
import { Outlet } from 'react-router-dom';

export function AppLayout(): JSX.Element {
  return (
    <main className="app-shell">
      <Outlet />
    </main>
  );
}
