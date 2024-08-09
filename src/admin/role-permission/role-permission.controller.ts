import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  createRolePermissionDto,
  CreateRolePermissionResponse,
  TCreateRolePermissionResponse,
} from './dto';
import { RolePermissionService } from './role-permission.service';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@Controller('role-permission')
@ApiTags('Role Permission')
@ApiBearerAuth()
@UsePipes(ZodValidationPipe)
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create role permission',
    type: CreateRolePermissionResponse,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createRolePermission(
    @Body() data: createRolePermissionDto,
  ): Promise<TCreateRolePermissionResponse> {
    const rolePermission =
      await this.rolePermissionService.createRolePermission(data);
    return rolePermission;
  }
}
