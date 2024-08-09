import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

const CategoryZ = z.object({
  id: z.number(),
  categoryName: z.string({ invalid_type_error: 'Invalid category name' }),
  categoryKey: z.string({ invalid_type_error: 'Invalid category key' }),
  categoryType: z.enum(['INCOME', 'EXPENSE'], {
    invalid_type_error: 'Invalid category type',
  }),
});

export class UpdateCategoryDto extends createZodDto(
  extendApi(CategoryZ.omit({ id: true })),
) {}
