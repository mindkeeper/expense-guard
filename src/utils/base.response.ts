import { z } from 'zod';

export const BaseResponse = z.object({
  status: z.boolean().default(true),
  statusCode: z.number().default(200),
  path: z.string(),
  timestamp: z.string(),
  message: z.string(),
});

export const BaseMeta = z.object({
  currentPage: z.number().default(1),
  perPage: z.number().default(10),
  total: z.number().default(40),
  totalPages: z.number().default(4),
  previousPage: z.number().nullable().default(null),
  nextPage: z.number().nullable().default(2),
});
