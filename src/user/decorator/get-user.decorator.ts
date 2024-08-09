import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type TUser = {
  id: number;
  email: string;
  username: string;
  imageUrl: string;
  isVerified: boolean;
  permissions: string[];
};
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as TUser;
  },
);
