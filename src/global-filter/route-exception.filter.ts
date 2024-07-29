import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

type TResponse<T> = {
  status: boolean;
  timestamp: string;
  path: string;
  statusCode: number;
  message: string;
  data: T;
};

@Catch(NotFoundException)
export class RouteExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const errorResponse: TResponse<any> = {
      status: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: HttpStatus.NOT_FOUND,
      message: `cannot find ${request.method} ${request.url}`,
      data: null,
    };
    response.status(HttpStatus.NOT_FOUND).json(errorResponse);
  }
}
