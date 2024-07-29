import { PrismaClient } from '@prisma/client';
import { superAdminPermissions } from './permission/super-admin.permission.seed';
import { roleSeed } from './role/role.seed';
import { permissionGroupSeed } from './permission/permission-group.seed';
import { permissionSeed } from './permission/permission-list';

const prisma = new PrismaClient();

async function main() {
  const rolePermissionSeed = [...superAdminPermissions];
  await prisma.role.createMany({ data: roleSeed });
  await prisma.permissionGroup.createMany({ data: permissionGroupSeed });
  await prisma.permission.createMany({ data: permissionSeed });
  await prisma.rolePermission.createMany({ data: rolePermissionSeed });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
