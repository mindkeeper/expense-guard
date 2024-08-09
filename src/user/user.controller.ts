import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/token/guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { GetUser, TUser } from './decorator';
import { PermissionStrategy } from 'src/token/strategy';
import { UpdateUserDto } from './dto';

@Controller('user')
@ApiTags('User')
@UsePipes(ZodValidationPipe)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtGuard, new PermissionStrategy(['get-permissions']))
  getMe(@GetUser() user: TUser): TUser {
    return user;
  }

  @Patch()
  @UseGuards(JwtGuard, new PermissionStrategy(['update-user']))
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateUser(@Body() data: UpdateUserDto) {
    return data;
  }
}
