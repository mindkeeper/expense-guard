import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { ZodIssue } from 'zod';
import { responseMessageKey } from '../decorator';

export interface IResponse<T> {
  status: boolean;
  tiemstamp: string;
  path: string;
  statusCode: number;
  message: string | { [key: string]: string }[] | ZodIssue[];
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponse<T>> | Promise<Observable<IResponse<T>>> {
    const message =
      this.reflector.get<string>(responseMessageKey, context.getHandler()) ||
      'Success';

    return next.handle().pipe(
      map((data) => ({
        status: true,
        tiemstamp: new Date().toISOString(),
        path: context.switchToHttp().getRequest().url,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message,
        data,
      })),
    );
  }
}
