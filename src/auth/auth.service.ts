import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto';
import { PrismaService } from 'src/common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signUpDto.email,
      },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    signUpDto.password = hashedPassword;
    const newUser = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        password: signUpDto.password,
        roleId: 2,
      },
      select: {
        email: true,
      },
    });

    return newUser;
  }

  // async authenticate(email: string, password: string) {

  async createToken(payload: any) {
    const token = await this.jwt.signAsync(payload);
    return { access_token: token };
  }

  async createRefreshToken(payload: any): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
    });
  }
}
