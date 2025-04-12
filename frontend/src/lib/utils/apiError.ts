export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleApiError = (error: any): APIError => {
  if (error instanceof APIError) {
    return error;
  }

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return new APIError(
      error.response.status,
      error.response.data?.message || 'An error occurred',
      error.response.data?.code,
      error.response.data?.details
    );
  } else if (error.request) {
    // The request was made but no response was received
    return new APIError(
      0,
      'No response received from server',
      'NETWORK_ERROR'
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    return new APIError(
      500,
      error.message || 'An unexpected error occurred',
      'UNKNOWN_ERROR'
    );
  }
};

export const isApiError = (error: any): error is APIError => {
  return error instanceof APIError;
};

export const getErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.message;
  }
  return 'An unexpected error occurred';
}; 