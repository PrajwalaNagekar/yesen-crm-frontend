import { apiRequest } from './client.js';

function buildProjectFormData(fields, imageFile, sitePhotographyFiles = [], sitePhotography = []) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (key === 'sitePhotography') return;
    formData.append(key, value ?? '');
  });
  formData.append('sitePhotography', JSON.stringify(sitePhotography));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  sitePhotographyFiles.forEach((file) => {
    formData.append('sitePhotographyFiles', file);
  });
  return formData;
}

export function fetchProjects({ page = 1, limit = 9, status, q, sort } = {}) {
  return apiRequest('/projects', { params: { page, limit, status, q, sort } });
}

export function fetchProject(id) {
  return apiRequest(`/projects/${id}`);
}

export function createProject(fields, imageFile, sitePhotographyFiles = [], sitePhotography = []) {
  return apiRequest('/projects', {
    method: 'POST',
    body: buildProjectFormData(fields, imageFile, sitePhotographyFiles, sitePhotography),
  });
}

export function updateProject(id, fields, imageFile, sitePhotographyFiles = [], sitePhotography = []) {
  return apiRequest(`/projects/${id}`, {
    method: 'PATCH',
    body: buildProjectFormData(fields, imageFile, sitePhotographyFiles, sitePhotography),
  });
}

export function deleteProject(id) {
  return apiRequest(`/projects/${id}`, { method: 'DELETE' });
}
