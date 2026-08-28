import { PERMISSIONS } from './permissions.js';

const PROJECT_PERMISSIONS = [
  PERMISSIONS.PROJECTS_CREATE,
  PERMISSIONS.PROJECTS_UPDATE,
  PERMISSIONS.PROJECTS_DELETE,
];

const PRODUCT_PERMISSIONS = [
  PERMISSIONS.PRODUCT_CREATE,
  PERMISSIONS.PRODUCT_UPDATE,
  PERMISSIONS.PRODUCT_DELETE,
];

const SOLUTION_PERMISSIONS = [
  PERMISSIONS.SOLUTIONS_CREATE,
  PERMISSIONS.SOLUTIONS_UPDATE,
  PERMISSIONS.SOLUTIONS_DELETE,
];

const TESTIMONIAL_PERMISSIONS = [
  PERMISSIONS.TESTIMONIALS_CREATE,
  PERMISSIONS.TESTIMONIALS_UPDATE,
  PERMISSIONS.TESTIMONIALS_DELETE,
];

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

  if (checked && PROJECT_PERMISSIONS.includes(permission)) {
    next = [...new Set([...next, PERMISSIONS.PROJECTS_READ])];
  }

  if (checked && PRODUCT_PERMISSIONS.includes(permission)) {
    next = [...new Set([...next, PERMISSIONS.PRODUCT_READ])];
  }

  if (checked && SOLUTION_PERMISSIONS.includes(permission)) {
    next = [...new Set([...next, PERMISSIONS.SOLUTIONS_READ])];
  }

  if (checked && TESTIMONIAL_PERMISSIONS.includes(permission)) {
    next = [...new Set([...next, PERMISSIONS.TESTIMONIALS_READ])];
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

  if (!checked && permission === PERMISSIONS.PROJECTS_READ) {
    next = next.filter((p) => !PROJECT_PERMISSIONS.includes(p));
  }

  if (!checked && permission === PERMISSIONS.PRODUCT_READ) {
    next = next.filter((p) => !PRODUCT_PERMISSIONS.includes(p));
  }

  if (!checked && permission === PERMISSIONS.SOLUTIONS_READ) {
    next = next.filter((p) => !SOLUTION_PERMISSIONS.includes(p));
  }

  if (!checked && permission === PERMISSIONS.TESTIMONIALS_READ) {
    next = next.filter((p) => !TESTIMONIAL_PERMISSIONS.includes(p));
  }

  return next;
}
