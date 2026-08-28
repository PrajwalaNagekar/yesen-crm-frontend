import { apiRequest } from './client.js';

function buildSolutionFormData(fields, imageFile) {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (key === 'benefits' || key === 'stats' || key === 'features') {
      formData.append(key, JSON.stringify(value ?? []));
    } else {
      formData.append(key, value ?? '');
    }
  });

  if (imageFile) {
    formData.append('image', imageFile);
  }

  return formData;
}

export function fetchSolutions() {
  return apiRequest('/solutions-csm');
}

export function fetchSolution(id) {
  return apiRequest(`/solutions-csm/${id}`);
}

export function createSolution(fields, imageFile) {
  return apiRequest('/solutions-csm', {
    method: 'POST',
    body: buildSolutionFormData(fields, imageFile),
  });
}

export function updateSolution(id, fields, imageFile) {
  return apiRequest(`/solutions-csm/${id}`, {
    method: 'PATCH',
    body: buildSolutionFormData(fields, imageFile),
  });
}

export function deleteSolution(id) {
  return apiRequest(`/solutions-csm/${id}`, { method: 'DELETE' });
}
