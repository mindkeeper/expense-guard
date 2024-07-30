import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignUpResponse, TSignUpResponse } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('auth')
@UsePipes(ZodValidationPipe)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('sign-up')
  @ApiResponse({
    status: 400,
    description: 'User already exists',
  })
  @ApiResponse({ status: 201, type: SignUpResponse })
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TSignUpResponse> {
    const { config } = this;
    const user = await this.authService.signUp(signUpDto);
    const token = await this.authService.createToken(user);
    const refreshToken = await this.authService.createRefreshToken(user);
    res.cookie(config.get('COOKIE_NAME'), refreshToken, {
      httpOnly: config.get('COOKIE_HTTP_ONLY'),
      secure: config.get('COOKIE_SECURE'),
      maxAge: config.get('COOKIE_MAX_AGE'),
      sameSite: config.get('COOKIE_SAME_SITE'),
      signed: true,
    });

    return token;
  }

  // @Post('sign-in')
  // @ApiResponse({ status: 200, type: SignUpResponse })
  // async signIn() {
  //   return 'sign-in';
  // }
}
