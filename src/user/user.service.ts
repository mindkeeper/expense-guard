import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        isVerified: true,
        role: {
          select: {
            permissions: {
              select: {
                permission: {
                  select: { permissionKey: true },
                },
              },
            },
          },
        },
      },
    });
    return user;
  }
}
