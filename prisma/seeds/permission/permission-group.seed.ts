import { PermissionGroup } from '@prisma/client';

export const permissionGroupSeed: PermissionGroup[] = [
  {
    id: 1,
    groupKey: 'user',
    groupName: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    groupKey: 'role',
    groupName: 'Role',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    groupKey: 'permission',
    groupName: 'Permission',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    groupKey: 'permission-group',
    groupName: 'Permission Group',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
