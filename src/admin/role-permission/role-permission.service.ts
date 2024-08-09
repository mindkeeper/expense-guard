import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { createRolePermissionDto } from './dto';

@Injectable()
export class RolePermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async createRolePermission(data: createRolePermissionDto) {
    return await this.prisma.rolePermission.createMany({
      data: data.map((item) => ({
        roleId: item.roleId,
        permissionId: item.permissionId,
      })),
    });
  }
}
