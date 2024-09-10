import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CommonModule } from '../../common/common.module';
import { PermissionController } from './permission.controller';

@Module({
  imports: [CommonModule],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports: [],
})
export class PermissionModule {}
