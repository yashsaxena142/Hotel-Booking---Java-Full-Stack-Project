const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ApiOptions {
  method?: string;
  data?: any;
  headers?: Record<string, string>;
}

async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', data, headers = {} } = options;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?message=Session expired. Please login again.';
      }
      throw new Error('Session expired');
    }

    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    // For 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

export const api = {
  get: (endpoint: string) => apiRequest(endpoint),
  
  post: (endpoint: string, data: any) => apiRequest(endpoint, { method: 'POST', data }),
  
  put: (endpoint: string, data: any) => apiRequest(endpoint, { method: 'PUT', data }),
  
  delete: (endpoint: string) => apiRequest(endpoint, { method: 'DELETE' }),
};