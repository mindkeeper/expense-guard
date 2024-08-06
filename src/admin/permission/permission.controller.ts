import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/token/guard';
import { PermissionStrategy } from 'src/token/strategy';
import { PermissionResponse, TAllPermissions } from './dto';
import { PermissionService } from './permission.service';

@Controller('permission')
@ApiTags('Permission')
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
}
