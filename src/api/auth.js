import { apiRequest } from './client.js';

export function login(username, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { username, password },
  });
}

export function fetchMe() {
  return apiRequest('/auth/me');
}

export function changePassword(currentPassword, newPassword) {
  return apiRequest('/auth/password', {
    method: 'PATCH',
    body: { currentPassword, newPassword },
  });
}

export function identifyForgotPassword(username) {
  return apiRequest('/auth/forgot-password/identify', {
    method: 'POST',
    body: { username },
  });
}

export function sendForgotPasswordOtp(username) {
  return apiRequest('/auth/forgot-password/send-otp', {
    method: 'POST',
    body: { username },
  });
}

export function verifyForgotPasswordOtp(username, otp) {
  return apiRequest('/auth/forgot-password/verify-otp', {
    method: 'POST',
    body: { username, otp },
  });
}

export function resetPasswordWithOtp(username, otp, newPassword) {
  return apiRequest('/auth/forgot-password/reset', {
    method: 'POST',
    body: { username, otp, newPassword },
  });
}
