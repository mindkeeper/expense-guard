import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './admin/permission/permission.module';

@Module({
  imports: [CommonModule, AuthModule, UserModule, PermissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
