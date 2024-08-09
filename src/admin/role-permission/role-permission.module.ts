import { Module } from '@nestjs/common';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [RolePermissionService],
  controllers: [RolePermissionController],
  exports: [],
})
export class RolePermissionModule {}
