import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError, ZodIssue } from 'zod';

type TResponse = {
  status: boolean;
  timestamp: string;
  path: string;
  statusCode: number;
  message: string | { [key: string]: string }[] | ZodIssue[];
  data: any;
  stackTrace?: string;
};

@Catch(HttpException, PrismaClientKnownRequestError, ZodError)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  constructor(private configService: ConfigService) {}

  catch(
    exception: HttpException | PrismaClientKnownRequestError | ZodError,
    host: ArgumentsHost,
  ) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    let status: number;
    let message: string | { [key: string]: string }[] | ZodIssue[];
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseError = exception.getResponse();
      if (typeof responseError === 'string') {
        message = responseError;
      } else {
        message = (responseError as { message: string }).message;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.BAD_REQUEST;
          message = `${(exception?.meta?.target as string[])[0]} already exists`;
          break;

        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR; // Default status for unhandled Prisma errors
          message = 'An unexpected database error occurred';
          break;
      }
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.issues;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }
    this.logger.error(
      `Exception: ${message}, Status: ${status}, Stack: ${exception.stack}`,
    );

    const errorResponse: TResponse = {
      status: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
      message,
      data: null,
      stackTrace: exception.stack,
    };

    if (isProduction) {
      delete errorResponse.stackTrace;
    }
    response.status(status).json(errorResponse);
  }
}
