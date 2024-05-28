export const ROLE_HIERARCHY = {
  owner: 100,
  admin: 50,
  editor: 20,
  viewer: 10,
} as const;

export type ROLE_TYPES = keyof typeof ROLE_HIERARCHY;

export const ROLE_HIGH_ENOUGH = (
  userRole: keyof typeof ROLE_HIERARCHY,
  requiredRole: keyof typeof ROLE_HIERARCHY
) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
