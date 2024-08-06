import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/token/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { GetUser } from './decorator';

@Controller('user')
@ApiTags('User')
@UsePipes(ZodValidationPipe)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async getMe(@GetUser() user: any) {
    return user;
  }
}
