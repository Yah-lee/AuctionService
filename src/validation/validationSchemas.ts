import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  repeat_password: z.string().min(6),
}).refine((data) => data.password === data.repeat_password, {
  message: "Passwords don't match",
  path: ['repeat_password'],
});
