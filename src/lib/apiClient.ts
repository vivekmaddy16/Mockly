const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  targetRole: string;
  experienceLevel: string;
  token: string;
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mockly_auth_token');
};

export const setAuthToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('mockly_auth_token', token);
  } else {
    localStorage.removeItem('mockly_auth_token');
  }
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('mockly_user_profile');
  return userJson ? JSON.parse(userJson) : null;
};

export const setStoredUser = (user: AuthUser | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('mockly_user_profile', JSON.stringify(user));
  } else {
    localStorage.removeItem('mockly_user_profile');
  }
};

// Generic API helper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'API Request failed');
  }
  return data as T;
}

export const authApi = {
  register: (payload: { name: string; email: string; password: string; targetRole?: string; experienceLevel?: string }) =>
    apiFetch<AuthUser>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  login: (payload: { email: string; password: string }) =>
    apiFetch<AuthUser>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  getMe: () => apiFetch<AuthUser>('/auth/me'),

  updateProfile: (payload: { name?: string; targetRole?: string; experienceLevel?: string; password?: string }) =>
    apiFetch<AuthUser>('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),
};
