import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  // providers: [PrismaService],
  // exports: [PrismaService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [],
  exports: [],
})
export class CommonModule {}
