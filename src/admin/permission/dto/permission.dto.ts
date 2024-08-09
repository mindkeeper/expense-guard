import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { BaseMeta, BaseResponse } from 'src/utils';
import { z } from 'zod';

const PermissionZ = extendApi(
  z.object({
    id: z.number(),
    permissionName: z.string(),
    permissionKey: z.string(),
    permissionGroup: z.object({
      groupName: z.string(),
    }),
    roles: z.array(
      z.object({
        id: z.number(),
        roleName: z.string(),
        roleKey: z.string(),
      }),
    ),
  }),
);

export const AllPermissions = z.object({
  items: z.array(PermissionZ.omit({ roles: true, permissionGroup: true })),
  meta: BaseMeta,
});

export class PermissionResponse extends createZodDto(
  BaseResponse.extend({
    data: AllPermissions,
  }),
) {}

export class PermissionDto extends createZodDto(
  z.array(
    z.object({
      permissionName: z.string(),
      permissionKey: z.string(),
      permissionGroupId: z.number(),
    }),
  ),
) {}

export class CreatePermissionResponse extends createZodDto(
  BaseResponse.extend({
    statusCode: z.number().default(201),
    data: z.object({
      count: z.number(),
    }),
  }),
) {}
export type TCreatePermissionResponse = {
  count: number;
};
export type TAllPermissions = z.infer<typeof AllPermissions>;

export class UpdatePemissionDto extends createZodDto(
  z.object({
    permissionName: z.string().optional(),
    permissionKey: z.string().optional(),
    permissionGroupId: z.number().optional(),
  }),
) {}

export class UpdatePermissionResponse extends createZodDto(
  BaseResponse.extend({
    data: z.object({
      id: z.number(),
      permissionName: z.string(),
      permissionKey: z.string(),
      permissionGroupId: z.number(),
    }),
  }),
) {}

export type TUpdatePemissionDto = {
  id: number;
  permissionName?: string;
  permissionKey?: string;
  permissionGroupId?: number;
};

//delete dto
export class DeletePermissionResponse extends createZodDto(
  BaseResponse.extend({
    data: z.object({
      id: z.number(),
      permissionName: z.string(),
      permissionKey: z.string(),
    }),
  }),
) {}

export type TDeletePermission = {
  id: number;
  permissionName: string;
  permissionKey: string;
};
