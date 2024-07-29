import { Role } from '@prisma/client';

export const roleSeed: Role[] = [
  {
    id: 1,
    roleKey: 'super-admin',
    roleName: 'Super Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    roleKey: 'admin',
    roleName: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    roleKey: 'user',
    roleName: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
