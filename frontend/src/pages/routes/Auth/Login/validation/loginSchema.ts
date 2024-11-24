import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(3, { message: 'Password should include at least 3 characters' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
