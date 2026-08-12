import { apiRequest } from './client.js';

export function fetchUsers() {
  return apiRequest('/users');
}

export function createUser(payload) {
  return apiRequest('/users', { method: 'POST', body: payload });
}

export function updateUser(id, updates) {
  return apiRequest(`/users/${id}`, { method: 'PATCH', body: updates });
}

export function deleteUser(id) {
  return apiRequest(`/users/${id}`, { method: 'DELETE' });
}
