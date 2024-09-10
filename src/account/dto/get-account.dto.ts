import { createZodDto } from '@anatine/zod-nestjs';
import { BaseMeta, BaseResponse } from '../..//utils';
import { z } from 'zod';

const AccountZ = z.object({
  id: z.number(),
  balance: z.number(),
  accountName: z.string(),
});

export const AllAccounts = z.object({
  items: z.array(AccountZ),
  meta: BaseMeta,
});

export type TAllAccounts = z.infer<typeof AllAccounts>;

export class AllAccountsResponse extends createZodDto(
  BaseResponse.extend({
    data: AllAccounts,
  }),
) {}
