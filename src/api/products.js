import { apiRequest } from './client.js';

function buildProductFormData(fields, imageFile) {
  const formData = new FormData();
  
  // Add all fields
  Object.entries(fields).forEach(([key, value]) => {
    if (key === 'benefits' || key === 'features') {
      // Convert arrays to JSON strings
      formData.append(key, JSON.stringify(value ?? []));
    } else {
      formData.append(key, value ?? '');
    }
  });
  
  // Add image file if provided
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  return formData;
}

export function fetchProducts({ q, sort } = {}) {
  return apiRequest('/products-csm', { params: { q, sort } });
}

export function fetchProduct(id) {
  return apiRequest(`/products-csm/${id}`);
}

export function createProduct(fields, imageFile) {
  return apiRequest('/products-csm', {
    method: 'POST',
    body: buildProductFormData(fields, imageFile),
  });
}

export function updateProduct(id, fields, imageFile) {
  return apiRequest(`/products-csm/${id}`, {
    method: 'PATCH',
    body: buildProductFormData(fields, imageFile),
  });
}

export function deleteProduct(id) {
  return apiRequest(`/products-csm/${id}`, { method: 'DELETE' });
}
