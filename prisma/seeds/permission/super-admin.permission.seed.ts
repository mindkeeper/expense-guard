import { RolePermission } from '@prisma/client';
import { permissionSeed } from './permission-list';

export const superAdminPermissions: RolePermission[] = permissionSeed.map(
  (permission) => ({
    permissionId: permission.id,
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
);
