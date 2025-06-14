type ApiResponse<T> =
  | { error: false; data: T }
  | { error: true; message: string; status?: number };
