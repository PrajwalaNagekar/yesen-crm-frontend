import { PERMISSIONS } from './permissions.js';

/** Apply permission toggle rules (control/create imply read). */
export function applyPermissionToggle(current, permission, checked) {
  let next = checked
    ? [...new Set([...current, permission])]
    : current.filter((p) => p !== permission);

  if (checked && permission === PERMISSIONS.PIPELINE_CONTROL) {
    next = [...new Set([...next, PERMISSIONS.PIPELINE_READ])];
  }

  if (checked && permission === PERMISSIONS.USERS_CREATE) {
    next = [...new Set([...next, PERMISSIONS.USERS_READ])];
  }

  if (checked && permission === PERMISSIONS.USERS_DELETE) {
    next = [...new Set([...next, PERMISSIONS.USERS_READ])];
  }

  if (checked && permission === PERMISSIONS.USERS_UPDATE) {
    next = [...new Set([...next, PERMISSIONS.USERS_READ])];
  }

  if (!checked && permission === PERMISSIONS.PIPELINE_READ) {
    next = next.filter((p) => p !== PERMISSIONS.PIPELINE_CONTROL);
  }

  if (!checked && permission === PERMISSIONS.USERS_READ) {
    next = next.filter(
      (p) =>
        p !== PERMISSIONS.USERS_CREATE &&
        p !== PERMISSIONS.USERS_UPDATE &&
        p !== PERMISSIONS.USERS_DELETE
    );
  }

  return next;
}
