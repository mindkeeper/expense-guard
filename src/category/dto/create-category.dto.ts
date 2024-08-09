import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { BaseMeta, BaseResponse } from 'src/utils';
import { z } from 'zod';

const CategoryZ = z.object({
  id: z.number(),
  categoryName: z.string({ invalid_type_error: 'Invalid category name' }),
  categoryKey: z.string({ invalid_type_error: 'Invalid category key' }),
  categoryType: z.enum(['INCOME', 'EXPENSE'], {
    invalid_type_error: 'Invalid category type',
  }),
});

export class CreateCategoryDto extends createZodDto(
  extendApi(CategoryZ.omit({ id: true })),
) {}

export class CreateCategoryResponse extends createZodDto(
  BaseResponse.extend({
    data: CategoryZ.extend({
      categoryName: z.string(),
    }),
  }),
) {}

export type TCategory = z.infer<typeof CategoryZ>;

export const AllCategories = z.object({
  items: z.array(CategoryZ),
  meta: BaseMeta,
});
export type TAllCategory = z.infer<typeof AllCategories>;
