import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TokenModule } from 'src/token/token.module';
import { PaginatorService } from './paginator.service';
import { config } from 'src/config/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PassportModule,
    TokenModule,
  ],
  providers: [PrismaService, PaginatorService],
  exports: [PrismaService, PaginatorService, PassportModule, TokenModule],
})
export class CommonModule {}
