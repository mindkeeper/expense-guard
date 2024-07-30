import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
  ],
})
export class CommonModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(this.config.get('COOKIE_SECRET')))
      .forRoutes('*');
  }
}
