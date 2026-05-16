import { type ApiResponse } from '@praxa/shared-types';

export async function parseApiResponse<TData>(response: Response): Promise<ApiResponse<TData>> {
  const payload = (await response.json()) as ApiResponse<TData>;

  return payload;
}
