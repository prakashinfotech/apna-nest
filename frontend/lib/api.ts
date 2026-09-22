let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api';
}

// Workaround for self-signed certificates on localhost (Next.js server-side)
if (typeof window === 'undefined' && API_BASE_URL.includes('localhost')) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}


type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, cache = 'no-store' } = options;

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // If we have a token in localStorage (browser side)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('apnanest_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),
    
  patch: <T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),
    
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
