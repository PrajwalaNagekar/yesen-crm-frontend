import { apiRequest } from './client.js';

export function fetchPipeline() {
  return apiRequest('/meta/pipeline');
}

export function fetchTeam() {
  return apiRequest('/meta/team');
}

export function fetchUnreadCounts() {
  return apiRequest('/meta/unread-counts');
}
