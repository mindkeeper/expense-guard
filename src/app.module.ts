import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './admin/permission/permission.module';
import { RolePermissionModule } from './admin/role-permission/role-permission.module';
import { AccountModule } from './account/account.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    PermissionModule,
    RolePermissionModule,
    AccountModule,
    CategoryModule,
    TransactionModule,
  ],
})
export class AppModule {}
