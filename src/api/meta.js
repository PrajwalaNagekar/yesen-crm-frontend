import { apiRequest } from './client.js';

export function fetchPipeline() {
  return apiRequest('/meta/pipeline');
}

export function fetchTeam() {
  return apiRequest('/meta/team');
}
