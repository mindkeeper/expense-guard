import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from './global-filter/all-exception.filter';
import { RouteExceptionFilter } from './global-filter/route-exception.filter';
import { HttpExceptionFilter } from './global-filter/http-exception.filter';
import { TransformResponseInterceptor } from './utils/interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { RequestMethod } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('/api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  const reflector = app.get(Reflector);

  // exception filter
  app.useGlobalFilters(
    new AllExceptionFilter(httpAdapterHost),
    new RouteExceptionFilter(),
    new HttpExceptionFilter(configService),
  );

  // interceptor
  app.useGlobalInterceptors(new TransformResponseInterceptor(reflector));

  // swagger
  if (configService.get('NODE_ENV') !== 'production') {
    const theme = new SwaggerTheme();
    const config = new DocumentBuilder()
      .setTitle('coffeshop')
      .setDescription('coffeshop API documentation')
      .setVersion('0.1')
      .addBearerAuth()
      .build();
    patchNestjsSwagger();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
      useGlobalPrefix: false,
      customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK),
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
  await app.listen(8080);
}
bootstrap();
