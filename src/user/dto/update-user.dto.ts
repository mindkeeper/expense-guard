import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

const User = z.object({
  imageUrl: z.string().url('Invalid URL').optional(),
});

export class UpdateUserDto extends createZodDto(extendApi(User)) {}
