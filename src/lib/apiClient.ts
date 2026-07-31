const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Types ───────────────────────────────────────────────────
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  targetRole: string;
  experienceLevel: string;
  isEmailVerified: boolean;
  lastLogin?: string;
  token: string;
}

// ─── Token Management ────────────────────────────────────────
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

// ─── Refresh Token Lock (prevents concurrent refresh requests) ─
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// ─── Refresh Access Token ────────────────────────────────────
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include', // sends httpOnly cookie
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error('Refresh failed');
    }

    const data = await res.json();
    setAuthToken(data.token);
    setStoredUser(data);
    return data.token;
  } catch {
    // Refresh failed — clear everything
    setAuthToken(null);
    setStoredUser(null);
    return null;
  }
};

// ─── Generic API Fetch with Auto-Refresh ─────────────────────
async function apiFetch<T>(endpoint: string, options: RequestInit = {}, retry = true): Promise<T> {
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
    credentials: 'include', // for refresh token cookie
  });

  // ─── Auto-Refresh on 401 TOKEN_EXPIRED ─────────────────
  if (res.status === 401 && retry) {
    const errorData = await res.json().catch(() => ({}));

    if (errorData.code === 'TOKEN_EXPIRED') {
      if (!isRefreshing) {
        isRefreshing = true;

        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
          onTokenRefreshed(newToken);
          // Retry the original request with new token
          return apiFetch<T>(endpoint, options, false);
        } else {
          // Force logout
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mockly:forceLogout'));
          }
          throw new Error('Session expired. Please login again.');
        }
      } else {
        // Wait for the ongoing refresh to complete
        return new Promise<T>((resolve, reject) => {
          subscribeTokenRefresh((newToken: string) => {
            headers['Authorization'] = `Bearer ${newToken}`;
            fetch(`${API_BASE_URL}${endpoint}`, {
              ...options,
              headers,
              credentials: 'include',
            })
              .then((retryRes) => {
                if (!retryRes.ok) throw new Error('Retry failed');
                return retryRes.json();
              })
              .then((data) => resolve(data as T))
              .catch(reject);
          });
        });
      }
    }

    throw new Error(errorData.error || 'Not authorized');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'API Request failed');
  }
  return data as T;
}

// ═══════════════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════════════
export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    password: string;
    targetRole?: string;
    experienceLevel?: string;
  }) => apiFetch<AuthUser & { message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  login: (payload: { email: string; password: string }) =>
    apiFetch<AuthUser>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  logout: () =>
    apiFetch<{ message: string }>('/auth/logout', { method: 'POST' }),

  getMe: () => apiFetch<AuthUser>('/auth/me'),

  updateProfile: (payload: {
    name?: string;
    targetRole?: string;
    experienceLevel?: string;
  }) => apiFetch<AuthUser>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ message: string }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiFetch<{ message: string }>(`/auth/reset-password/${token}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    }),

  verifyEmail: (token: string) =>
    apiFetch<{ message: string }>(`/auth/verify-email/${token}`),

  resendVerification: () =>
    apiFetch<{ message: string }>('/auth/resend-verification', { method: 'POST' }),

  refreshToken: () => refreshAccessToken(),
};

// ═══════════════════════════════════════════════════════════════
// INTERVIEW API
// ═══════════════════════════════════════════════════════════════
export interface PaginatedSessions {
  sessions: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const interviewApi = {
  createSession: (payload: {
    sessionId?: string;
    targetRole: string;
    experienceLevel: string;
    difficultyMode?: string;
    roundType?: string;
    resumeText?: string;
    jobDescriptionText?: string;
    extractedSkills?: string[];
    questions?: any[];
  }) => apiFetch<any>('/interviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  getSessions: (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    return apiFetch<PaginatedSessions>(`/interviews?${params.toString()}`);
  },

  getSessionById: (id: string) => apiFetch<any>(`/interviews/${id}`),

  updateEvaluation: (sessionId: string, questionId: string, evaluation: any) =>
    apiFetch<any>(`/interviews/${sessionId}/eval`, {
      method: 'PUT',
      body: JSON.stringify({ questionId, evaluation }),
    }),

  completeSession: (sessionId: string, overallFeedback?: any) =>
    apiFetch<any>(`/interviews/${sessionId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ overallFeedback }),
    }),

  deleteSession: (sessionId: string) =>
    apiFetch<{ message: string }>(`/interviews/${sessionId}`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════════════════════════════
// PROGRESS API
// ═══════════════════════════════════════════════════════════════
export const progressApi = {
  getStats: () => apiFetch<any>('/progress/stats'),

  getTrends: (days = 30) => apiFetch<any>(`/progress/trends?days=${days}`),

  trackActivity: (payload: {
    questionsAnswered?: number;
    topicsPracticed?: string[];
    timeSpentMinutes?: number;
  }) => apiFetch<any>('/progress/track', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};

// ═══════════════════════════════════════════════════════════════
// ROADMAP API (MySQL — optional)
// ═══════════════════════════════════════════════════════════════
export const roadmapApi = {
  getRoadmap: (category?: string) => {
    const params = category ? `?category=${category}` : '';
    return apiFetch<any>(`/roadmap${params}`);
  },

  getRoadmapByCategory: (category: string) =>
    apiFetch<any>(`/roadmap/${category}`),

  completeStep: (stepId: number, notes?: string) =>
    apiFetch<any>(`/roadmap/${stepId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    }),
};

// ═══════════════════════════════════════════════════════════════
// RESUME API (MySQL — optional)
// ═══════════════════════════════════════════════════════════════
export const resumeApi = {
  getResumes: () => apiFetch<any[]>('/resumes'),

  getResumeById: (id: number) => apiFetch<any>(`/resumes/${id}`),

  createResume: (payload: {
    title?: string;
    resumeText: string;
    targetRole?: string;
    sections?: any;
    parsedSkills?: string[];
    atsScore?: number;
    atsAnalysis?: any;
  }) => apiFetch<any>('/resumes', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  updateResume: (id: number, payload: any) =>
    apiFetch<any>(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteResume: (id: number) =>
    apiFetch<{ message: string }>(`/resumes/${id}`, { method: 'DELETE' }),
};
