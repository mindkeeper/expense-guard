import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/token/guard';
import { PermissionStrategy } from 'src/token/strategy';
import {
  CreatePermissionResponse,
  DeletePermissionResponse,
  PermissionDto,
  PermissionResponse,
  TAllPermissions,
  TCreatePermissionResponse,
  TDeletePermission,
  TUpdatePemissionDto,
  UpdatePemissionDto,
  UpdatePermissionResponse,
} from './dto';
import { PermissionService } from './permission.service';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@Controller('permission')
@ApiTags('Permission')
@UsePipes(ZodValidationPipe)
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get permission List',
    type: PermissionResponse,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'permissionName', required: false })
  @ApiQuery({ name: 'permissionKey', required: false })
  @ApiQuery({ name: 'permissionGroup', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'sortField', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  @UseGuards(JwtGuard, new PermissionStrategy(['get-permissions']))
  async findAll(
    @Query('permissionName') permissionName: string,
    @Query('permissionKey') permissionKey: string,
    @Query('permissionGroup') permissionGroup: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('perPage', new ParseIntPipe({ optional: true })) perPage: number,
    @Query('sortField', new DefaultValuePipe('id')) sortField: string,
    @Query('sortDirection', new DefaultValuePipe('asc'))
    sortDirection: 'asc' | 'desc',
  ): Promise<TAllPermissions> {
    const query = {
      permissionName,
      permissionKey,
      permissionGroup,
      page,
      perPage,
      sortField,
      sortDirection,
    };

    return await this.permissionService.findAll(query);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create permission',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    type: CreatePermissionResponse,
  })
  @UseGuards(JwtGuard, new PermissionStrategy(['create-permission']))
  async createPermission(
    @Body() permissionDto: PermissionDto,
  ): Promise<TCreatePermissionResponse> {
    return await this.permissionService.createPermission(permissionDto);
  }

  @Patch(':id')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({
    status: 200,
    description: 'Permission updated successfully',
    type: UpdatePermissionResponse,
  })
  @UseGuards(JwtGuard, new PermissionStrategy(['update-permission']))
  async updatePermission(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdatePemissionDto,
  ): Promise<TUpdatePemissionDto> {
    return await this.permissionService.updatePermission(id, body);
  }

  @Delete(':id')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({
    status: 200,
    description: 'Permission deleted successfully',
    type: DeletePermissionResponse,
  })
  @UseGuards(JwtGuard, new PermissionStrategy(['delete-permission']))
  async deletePermission(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<TDeletePermission> {
    return await this.permissionService.deletePermission(id);
  }
}
