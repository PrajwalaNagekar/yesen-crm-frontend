import { apiRequest } from './client.js';

export function submitProductIntake(payload) {
  return apiRequest('/inquiries/intake/product', { method: 'POST', body: payload });
}

export function submitServiceIntake(payload) {
  return apiRequest('/inquiries/intake/service', { method: 'POST', body: payload });
}

export function submitContactIntake(payload) {
  return apiRequest('/inquiries/intake/contact', { method: 'POST', body: payload });
}
