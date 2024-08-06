import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionStrategy implements CanActivate {
  constructor(private readonly allowedPermissions: string[]) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { permissions } = request.user;

    return this.allowedPermissions.some((permission) =>
      new Set(permissions).has(permission),
    );
  }
}
