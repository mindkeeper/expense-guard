import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { PassportModule } from '@nestjs/passport';
import { PaginatorService } from './paginator.service';
import { config } from 'src/config/config';
import { TokenModule } from './token.module';
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
export class CommonModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(this.config.get('COOKIE_SECRET')))
      .forRoutes('*');
  }
}
