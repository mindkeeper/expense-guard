import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { BaseResponse } from 'src/utils';
import { z } from 'zod';

const AuthZ = extendApi(
  z.object({
    identifier: z.string(),
    password: z.string(),
  }),
);

export class SignInDto extends createZodDto(AuthZ) {}
export class SignInResponse extends createZodDto(
  BaseResponse.extend({
    data: z.object({
      access_token: z.string(),
    }),
  }),
) {}

export type TSignInResponse = {
  access_token: string;
};
