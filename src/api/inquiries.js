import { apiRequest, getToken } from './client.js';

export function fetchBoard({ tag, source, q, assignedTo } = {}) {
  return apiRequest('/inquiries', { params: { board: 'true', tag, source, q, assignedTo } });
}

export function fetchInquiry(id) {
  return apiRequest(`/inquiries/${id}`);
}

export function updateInquiry(id, updates) {
  return apiRequest(`/inquiries/${id}`, { method: 'PATCH', body: updates });
}

export function markInquiryViewed(id) {
  return apiRequest(`/inquiries/${id}/viewed`, { method: 'PATCH' });
}

export function moveInquiryStage(id, stage, lostReason) {
  return apiRequest(`/inquiries/${id}/stage`, { method: 'PATCH', body: { stage, lostReason } });
}

export function deleteInquiry(id) {
  return apiRequest(`/inquiries/${id}`, { method: 'DELETE' });
}

export function addTag(id, tag) {
  return apiRequest(`/inquiries/${id}/tags`, { method: 'POST', body: { tag } });
}

export function removeTag(id, tag) {
  return apiRequest(`/inquiries/${id}/tags/${encodeURIComponent(tag)}`, { method: 'DELETE' });
}

export function setQuotationStatus(id, sent) {
  return apiRequest(`/inquiries/${id}/quotation`, { method: 'PATCH', body: { sent } });
}

export function fetchLogs(id) {
  return apiRequest(`/inquiries/${id}/logs`);
}

export function addLog(id, type, message) {
  return apiRequest(`/inquiries/${id}/logs`, { method: 'POST', body: { type, message } });
}

export function fetchDocuments(id) {
  return apiRequest(`/inquiries/${id}/documents`);
}

export function uploadDocument(id, file, type) {
  const formData = new FormData();
  formData.append('file', file);
  if (type) formData.append('type', type);
  return apiRequest(`/inquiries/${id}/documents`, { method: 'POST', body: formData });
}

export function deleteDocument(docId) {
  return apiRequest(`/documents/${docId}`, { method: 'DELETE' });
}

// The download endpoint requires the Authorization header, so a plain
// <a href> won't carry the token - fetch it as a blob and trigger the
// browser's save behavior manually instead.
export async function downloadDocument(docId, filename) {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  const response = await fetch(`${base}/documents/${docId}/download`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) throw new Error('Failed to download document');

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'document';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
