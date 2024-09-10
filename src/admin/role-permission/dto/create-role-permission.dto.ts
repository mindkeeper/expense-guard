import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { BaseResponse } from '../../../utils';
import { z } from 'zod';

const RolePermissionZ = extendApi(
  z.object({
    roleId: z.number({
      required_error: 'Role ID is required',
      invalid_type_error: 'Role ID must be a number',
    }),
    permissionId: z.number({
      invalid_type_error: 'Permission ID must be a number',
      required_error: 'Permission ID is required',
      message: 'Permission ID must be a number',
    }),
  }),
);

export class createRolePermissionDto extends createZodDto(
  z.array(RolePermissionZ),
) {}

export class CreateRolePermissionResponse extends createZodDto(
  BaseResponse.extend({
    data: z.object({
      count: z.number(),
    }),
  }),
) {}

export type TCreateRolePermissionResponse = {
  count: number;
};
