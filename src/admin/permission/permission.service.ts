import { Injectable } from '@nestjs/common';
import { PaginatorService } from 'src/common/paginator.service';
import { PrismaService } from 'src/common/prisma.service';
import { TAllPermissionQUery, TAllPermissions } from './dto';

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
}
