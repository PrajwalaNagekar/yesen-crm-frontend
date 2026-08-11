import { apiRequest } from './client.js';

export function login(username, password) {
  return apiRequest('/auth/login', { method: 'POST', body: { username, password } });
}

export function fetchMe() {
  return apiRequest('/auth/me');
}

export function changePassword(currentPassword, newPassword) {
  return apiRequest('/auth/password', { method: 'PATCH', body: { currentPassword, newPassword } });
}
