export const PERMISSIONS = {
  PIPELINE_READ: 'pipeline.read',
  PIPELINE_CONTROL: 'pipeline.control',
  USERS_CREATE: 'users.create',
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  PROJECTS_CREATE: 'projects.create',
  PROJECTS_READ: 'projects.read',
  PROJECTS_UPDATE: 'projects.update',
  PROJECTS_DELETE: 'projects.delete',
  TESTIMONIALS_CREATE: 'testimonials.create',
  TESTIMONIALS_READ: 'testimonials.read',
  TESTIMONIALS_UPDATE: 'testimonials.update',
  TESTIMONIALS_DELETE: 'testimonials.delete',
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
  {
    module: 'projects',
    label: 'Projects',
    permissions: [
      { key: PERMISSIONS.PROJECTS_CREATE, label: 'Add project' },
      { key: PERMISSIONS.PROJECTS_READ, label: 'Read projects' },
      { key: PERMISSIONS.PROJECTS_UPDATE, label: 'Edit project' },
      { key: PERMISSIONS.PROJECTS_DELETE, label: 'Delete project' },
    ],
  },
  {
    module: 'testimonials',
    label: 'Testimonials',
    permissions: [
      { key: PERMISSIONS.TESTIMONIALS_CREATE, label: 'Add testimonial' },
      { key: PERMISSIONS.TESTIMONIALS_READ, label: 'Read testimonials' },
      { key: PERMISSIONS.TESTIMONIALS_UPDATE, label: 'Edit testimonial' },
      { key: PERMISSIONS.TESTIMONIALS_DELETE, label: 'Delete testimonial' },
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

export function canControlPipeline(user) {
  return hasPermission(user, PERMISSIONS.PIPELINE_CONTROL);
}

export function canCreateProject(user) {
  return hasPermission(user, PERMISSIONS.PROJECTS_CREATE);
}

export function canUpdateProject(user) {
  return hasPermission(user, PERMISSIONS.PROJECTS_UPDATE);
}

export function canDeleteProject(user) {
  return hasPermission(user, PERMISSIONS.PROJECTS_DELETE);
}

export function canCreateTestimonial(user) {
  return hasPermission(user, PERMISSIONS.TESTIMONIALS_CREATE);
}

export function canUpdateTestimonial(user) {
  return hasPermission(user, PERMISSIONS.TESTIMONIALS_UPDATE);
}

export function canDeleteTestimonial(user) {
  return hasPermission(user, PERMISSIONS.TESTIMONIALS_DELETE);
}

export function hasModuleAccess(user, module) {
  if (!user || !module) return false;
  if (isAdminRole(user.role)) return true;

  const granted = getUserPermissions(user);
  const prefix = `${module}.`;
  return granted.some((p) => p.startsWith(prefix));
}

export function getUserPermissionGroups(user) {
  if (!user) return [];

  if (isAdminRole(user.role)) {
    return PERMISSION_GROUPS.map((group) => ({
      label: group.label,
      module: group.module,
      permissions: group.permissions.map((p) => p.label),
    }));
  }

  const granted = getUserPermissions(user);
  return PERMISSION_GROUPS.map((group) => ({
    label: group.label,
    module: group.module,
    permissions: group.permissions.filter((p) => granted.includes(p.key)).map((p) => p.label),
  })).filter((group) => group.permissions.length > 0);
}

export function getDefaultRoute(user) {
  if (hasModuleAccess(user, 'pipeline')) return '/';
  if (hasModuleAccess(user, 'users')) return '/users';
  if (hasModuleAccess(user, 'projects')) return '/csm/projects';
  if (hasModuleAccess(user, 'testimonials')) return '/testimonials';
  return '/settings';
}

export function resolvePostAuthPath(user, fromPath) {
  if (fromPath && fromPath !== '/login') {
    if (fromPath === '/' && hasModuleAccess(user, 'pipeline')) return '/';
    if (fromPath.startsWith('/users') && hasModuleAccess(user, 'users')) return fromPath;
    if (fromPath.startsWith('/csm/projects') && hasModuleAccess(user, 'projects')) return fromPath;
    if (fromPath.startsWith('/testimonials') && hasModuleAccess(user, 'testimonials')) return fromPath;
    if (fromPath.startsWith('/settings')) return fromPath;
  }
  return getDefaultRoute(user);
}
