import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './feedback/ErrorState';
interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(): State {
    return { hasError: true };
  }
  componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {}
  render() {
    if (this.state.hasError) return <ErrorState message="Unexpected application error." />;
    return this.props.children;
  }
}
