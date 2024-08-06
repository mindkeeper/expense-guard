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

export type TAllPermissions = z.infer<typeof AllPermissions>;
