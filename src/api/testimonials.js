import { apiRequest } from './client.js';

export function fetchTestimonials({ page = 1, limit = 10 } = {}) {
  return apiRequest('/testimonials', { params: { page, limit } });
}

export function fetchTestimonial(id) {
  return apiRequest(`/testimonials/${id}`);
}

export function createTestimonial(payload) {
  return apiRequest('/testimonials', { method: 'POST', body: payload });
}

export function updateTestimonial(id, updates) {
  return apiRequest(`/testimonials/${id}`, { method: 'PATCH', body: updates });
}

export function deleteTestimonial(id) {
  return apiRequest(`/testimonials/${id}`, { method: 'DELETE' });
}
