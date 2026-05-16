import { type JSX } from 'react';

export function DashboardPage(): JSX.Element {
  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <p className="eyebrow">Production SaaS foundation</p>
      <h1 id="dashboard-title">Praxa Dashboard</h1>
      <p>Monorepo architecture is ready for product development.</p>
    </section>
  );
}
