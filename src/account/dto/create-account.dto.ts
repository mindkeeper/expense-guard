import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { BaseResponse } from 'src/utils';
import { z } from 'zod';

const AccountZ = extendApi(
  z.object({
    accountName: z.string({ invalid_type_error: 'Invalid account name' }),
  }),
);

export class CreateAccountDto extends createZodDto(AccountZ) {}
export class CreateAccountResponse extends createZodDto(
  BaseResponse.extend({
    data: z.object({
      id: z.number(),
      userId: z.number(),
      accountName: z.string(),
      balance: z.number(),
    }),
  }),
) {}

export type TCreateAccountResponse = {
  id: number;
  userId: number;
  accountName: string;
  balance: number;
};
