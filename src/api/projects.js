import { apiRequest } from './client.js';

function buildProjectFormData(fields, imageFile) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value ?? '');
  });
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return formData;
}

export function fetchProjects({ page = 1, limit = 9, status } = {}) {
  return apiRequest('/projects', { params: { page, limit, status } });
}

export function fetchProject(id) {
  return apiRequest(`/projects/${id}`);
}

export function createProject(fields, imageFile) {
  return apiRequest('/projects', {
    method: 'POST',
    body: buildProjectFormData(fields, imageFile),
  });
}

export function updateProject(id, fields, imageFile) {
  return apiRequest(`/projects/${id}`, {
    method: 'PATCH',
    body: buildProjectFormData(fields, imageFile),
  });
}

export function deleteProject(id) {
  return apiRequest(`/projects/${id}`, { method: 'DELETE' });
}
