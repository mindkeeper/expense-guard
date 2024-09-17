import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(
          'configService.get(JWT_SECRET)',
          configService.get('JWT_SECRET'),
        );
        console.log(
          'configService.get(JWT_EXPiRES_IN)',
          configService.get('JWT_EXPiRES_IN'),
        );
        return {
          global: true,
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPiRES_IN'),
            issuer: configService.get('JWT_ISSUER'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class TokenModule {}
