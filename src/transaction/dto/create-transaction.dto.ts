import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { BaseResponse } from '../../utils';
import { z } from 'zod';

const TransactionZ = z.object({
  id: z.number(),
  userId: z.number(),
  categoryId: z.number(),
  accountId: z.number(),
  amount: z.number(),
  transactionDate: z.string().refine((value) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(value);
  }, 'Invalid date format (dd-mm-yyyy)'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    invalid_type_error: 'Invalid transaction type',
    required_error: 'Transaction type is required',
  }),
  description: z
    .string({ invalid_type_error: 'Invalid description' })
    .optional(),
});

export class CreateTransactionDto extends createZodDto(
  extendApi(TransactionZ.omit({ id: true, userId: true })),
) {}

export class CreateTransactionResponse extends createZodDto(
  BaseResponse.extend({
    data: TransactionZ.extend({
      transactionDate: z.string(),
    }),
  }),
) {}

export type TTransaction = z.infer<typeof TransactionZ>;
