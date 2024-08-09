import { Injectable } from '@nestjs/common';
import { PaginatorService } from 'src/common/paginator.service';
import { PrismaService } from 'src/common/prisma.service';
import {
  PermissionDto,
  TAllPermissionQUery,
  TAllPermissions,
  TDeletePermission,
  TUpdatePemissionDto,
  UpdatePemissionDto,
} from './dto';

type TPermission = {
  id: number;
  permissionName: string;
  permissionKey: string; // Note the typo here, it should match the Prisma schema if it's a typo there as well.
  permissionGroup: {
    name: string;
  };
  permissionGroupName: string;
};

@Injectable()
export class PermissionService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
  ) {}

  async findAll(query: TAllPermissionQUery): Promise<TAllPermissions> {
    const filter: any[] = [];
    if (query.permissionName) {
      filter.push({
        permissionName: { contains: query.permissionName, mode: 'insensitive' },
      });
    }
    if (query.permissionKey) {
      filter.push({
        permissionKey: { contains: query.permissionKey, mode: 'insensitive' },
      });
    }
    if (query.permissionGroup) {
      filter.push({
        permissionGroup: {
          name: { contains: query.permissionGroup, mode: 'insensitive' },
        },
      });
    }

    const { items, meta } = await this.paginator.paginate(
      this.prisma.permission,
      {
        where: {
          AND: filter,
        },
        select: {
          id: true,
          permissionName: true,
          permissionKey: true,
        },
        orderBy: {
          [query.sortField]: query.sortDirection,
        },
      },
      { page: query.page, perPage: query.perPage },
    );
    return {
      items,
      meta,
    };
  }

  async createPermission(permissionDto: PermissionDto) {
    const data = permissionDto.map((permission) => {
      return {
        permissionName: permission.permissionName,
        permissionKey: permission.permissionKey,
        permissionGroupId: permission.permissionGroupId,
      };
    });
    const permisssions = await this.prisma.permission.createMany({
      data,
    });

    return { count: permisssions.count };
  }

  async updatePermission(
    id: number,
    body: UpdatePemissionDto,
  ): Promise<TUpdatePemissionDto> {
    // Implement this method
    const permission = await this.prisma.permission.update({
      where: { id },
      data: body,
      select: {
        id: true,
        permissionName: true,
        permissionKey: true,
        permissionGroupId: true,
      },
    });

    return permission;
  }

  async deletePermission(id: number): Promise<TDeletePermission> {
    // Implement this method
    const permission = await this.prisma.permission.delete({
      where: { id },
      select: {
        id: true,
        permissionName: true,
        permissionKey: true,
      },
    });
    return permission;
  }
}
