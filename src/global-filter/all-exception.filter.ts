import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';

type TResponse<T> = {
  status: boolean;
  timestamp: string;
  path: string;
  statusCode: number;
  message: string;
  data: T;
  expiresIn: string;
  secret: string;
};

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  constructor(
    private httpAdapterHost: HttpAdapterHost,
    private config: ConfigService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(
      `Exception: ${exception.message}, Status: ${status}, Stack: ${exception.stack}`,
    );

    const jwtSecret = this.config.get('JWT_SECRET');
    const expiresIn = this.config.get('JWT_EXPIRES_IN');
    this.logger.error(`jwtSecret: ${jwtSecret}`);
    this.logger.error(`expiresIn: ${expiresIn}`);
    const response: TResponse<any> = {
      status: false,
      timestamp: new Date().toISOString(),
      path: context.getRequest().url,
      statusCode: status,
      message: exception.message,
      data: null,
      expiresIn,
      secret: jwtSecret,
    };
    httpAdapter.reply(context.getResponse(), response, status);
  }
}
