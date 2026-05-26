import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { ErrorState } from './ErrorState';
export function RouteErrorBoundary() {
  const err = useRouteError();
  if (isRouteErrorResponse(err)) return <ErrorState message={`${err.status} ${err.statusText}`} />;
  return <ErrorState />;
}
