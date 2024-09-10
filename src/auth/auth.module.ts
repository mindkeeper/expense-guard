import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from '../common/common.module';
import { UserService } from '../user/user.service';
import { JwtStrategy } from '../token/strategy';

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule {}
