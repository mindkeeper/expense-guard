import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from './global-filter/all-exception.filter';
import { RouteExceptionFilter } from './global-filter/route-exception.filter';
import { HttpExceptionFilter } from './global-filter/http-exception.filter';
import { TransformResponseInterceptor } from './utils/interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('/api');

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
      swaggerOptions: { persistAuthorization: true },
    });
  }
  await app.listen(8080);
}
bootstrap();
