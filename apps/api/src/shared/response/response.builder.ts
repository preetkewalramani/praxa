import {
  type ApiErrorResponse,
  type ApiSuccessResponse,
  type ResponseMeta,
} from './api-response.types';

export function buildSuccessResponse<TData>(
  data: TData,
  meta?: ResponseMeta,
): ApiSuccessResponse<TData> {
  return {
    success: true,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
}

export function buildErrorResponse(
  error: ApiErrorResponse['error'],
  meta?: ResponseMeta,
): ApiErrorResponse {
  return {
    success: false,
    error,
    meta,
    timestamp: new Date().toISOString(),
  };
}
