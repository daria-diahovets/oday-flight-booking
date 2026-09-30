const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = (await res
      .json()
      .catch(() => ({ error: 'Unknown error' }))) as ApiError;
    throw body;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
};
