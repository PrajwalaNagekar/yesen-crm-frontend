// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://yesen-crm-backend-5.onrender.com/api/v1';

const TOKEN_KEY = 'yesen_crm_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Error thrown for any non-2xx API response. Carries the backend's error
 * message, HTTP status, and requestId (see errorHandler.js on the backend)
 * so the UI can show something useful and support can trace a report back
 * to server logs.
 */
export class ApiError extends Error {
  constructor(message, status, requestId, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.requestId = requestId;
    this.details = details;
  }
}

/**
 * Core request helper. `body` may be a plain object (sent as JSON) or a
 * FormData instance (sent as-is, for file uploads) - fetch sets the right
 * Content-Type automatically for FormData, so we only set it ourselves
 * for JSON bodies.
 */
export async function apiRequest(path, { method = 'GET', body, params, signal } = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  const isFormData = body instanceof FormData;
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isFormData) headers['Content-Type'] = 'application/json';

  const response = await fetch(url, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    signal,
  });

  // 204 No Content - nothing to parse
  if (response.status === 204) return null;

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Expired / invalid session — clear token so ProtectedRoute sends the
    // user back to login on the next render instead of looping on 401s.
    if (response.status === 401 && token && !path.startsWith('/auth/login')) {
      setToken(null);
      window.dispatchEvent(new Event('yesen:unauthorized'));
    }
    const message = (isJson && payload?.error) || response.statusText || 'Request failed';
    throw new ApiError(message, response.status, isJson ? payload?.requestId : undefined, payload?.details);
  }

  return payload;
}
