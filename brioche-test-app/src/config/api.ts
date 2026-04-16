const fallbackApiBaseUrl = 'http://127.0.0.1:8000/api';

export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL ?? fallbackApiBaseUrl).replace(
  /\/+$/,
  '',
);
