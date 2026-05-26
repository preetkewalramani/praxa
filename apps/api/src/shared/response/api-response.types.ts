export interface ResponseMeta {
  correlationId?: string;
  durationMs?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  meta?: ResponseMeta;
  timestamp: string;
}

export interface ApiErrorPayload {
  code: string;
  details?: unknown;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
  meta?: ResponseMeta;
  timestamp: string;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
