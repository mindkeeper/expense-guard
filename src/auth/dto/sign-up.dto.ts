import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

const SignUpZ = extendApi(
  z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
);

export class SignUpDto extends createZodDto(SignUpZ) {}
