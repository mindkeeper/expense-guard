import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { BaseResponse } from 'src/utils';
import { z } from 'zod';

const SignUpZ = extendApi(
  z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d).*$/,
        'Password must contain at least one letter and one digit',
      ),
  }),
);

export class SignUpDto extends createZodDto(SignUpZ) {}

export class SignUpResponse extends createZodDto(
  BaseResponse.extend({
    statusCode: z.number().default(201),
    data: z.object({
      access_token: z.string(),
    }),
  }),
) {}

export type TSignUpResponse = {
  access_token: string;
};
