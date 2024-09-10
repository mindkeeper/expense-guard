import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        isVerified: true,
        username: true,
        imageUrl: true,
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
