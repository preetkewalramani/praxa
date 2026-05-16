import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  override state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Praxa web application boundary caught an error.', { error, errorInfo });
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <main className="app-shell" role="alert">
          <section className="dashboard-page">
            <p className="eyebrow">Something went wrong</p>
            <h1>Praxa is unavailable</h1>
            <p>Please refresh the page. If the problem persists, contact support.</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
