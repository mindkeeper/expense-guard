import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

type TResponse<T> = {
  status: boolean;
  timestamp: string;
  path: string;
  statusCode: number;
  message: string;
  data: T;
};

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  constructor(private httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(
      `Exception: ${exception.message}, Status: ${status}, Stack: ${exception.stack}`,
    );

    const response: TResponse<any> = {
      status: false,
      timestamp: new Date().toISOString(),
      path: context.getRequest().url,
      statusCode: status,
      message: exception.message,
      data: null,
    };
    httpAdapter.reply(context.getResponse(), response, status);
  }
}
