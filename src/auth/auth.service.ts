import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from 'src/common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private userService: UserService,
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

  async authenticate(dto: SignInDto) {
    const { identifier, password } = dto;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
      select: {
        email: true,
        password: true,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return { email: user.email };
  }

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

  async validateUser(email: string) {
    return await this.userService.findByEmail(email);
  }
}
