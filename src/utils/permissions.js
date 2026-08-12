export const PERMISSIONS = {
  PIPELINE_READ: 'pipeline.read',
  PIPELINE_CONTROL: 'pipeline.control',
  USERS_CREATE: 'users.create',
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_GROUPS = [
  {
    module: 'pipeline',
    label: 'Pipeline',
    permissions: [
      { key: PERMISSIONS.PIPELINE_READ, label: 'Read pipeline' },
      { key: PERMISSIONS.PIPELINE_CONTROL, label: 'Control pipeline' },
    ],
  },
  {
    module: 'users',
    label: 'Users',
    permissions: [
      { key: PERMISSIONS.USERS_CREATE, label: 'Create user' },
      { key: PERMISSIONS.USERS_READ, label: 'Read all users' },
      { key: PERMISSIONS.USERS_UPDATE, label: 'Update user' },
      { key: PERMISSIONS.USERS_DELETE, label: 'Delete user' },
    ],
  },
];

export function isAdminRole(role) {
  return String(role || '').trim().toLowerCase() === 'admin';
}

export function normalizePermissions(permissions) {
  return Array.isArray(permissions) ? permissions.filter(Boolean) : [];
}

export function getUserPermissions(user) {
  if (!user) return [];
  if (isAdminRole(user.role)) {
    return user.effectivePermissions?.length ? user.effectivePermissions : ALL_PERMISSIONS;
  }
  return user.effectivePermissions?.length
    ? user.effectivePermissions
    : normalizePermissions(user.permissions);
}

export function hasPermission(user, permission) {
  if (!user || !permission) return false;
  if (isAdminRole(user.role)) return true;

  const granted = getUserPermissions(user);
  if (granted.includes(permission)) return true;

  if (permission === PERMISSIONS.PIPELINE_READ && granted.includes(PERMISSIONS.PIPELINE_CONTROL)) {
    return true;
  }

  return false;
}
