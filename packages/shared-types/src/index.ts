export interface ApiResponse<TData> {
  data: TData;
  message?: string;
  success: boolean;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
  success: false;
}

export interface PaginationParams {
  limit: number;
  page: number;
}

export interface PaginatedResponse<TItem> {
  items: TItem[];
  meta: {
    limit: number;
    page: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CreateDtoPlaceholder {
  name: string;
}

export interface UpdateDtoPlaceholder {
  name?: string;
}
