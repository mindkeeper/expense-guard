import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [CommonModule],
})
export class AccountModule {}
