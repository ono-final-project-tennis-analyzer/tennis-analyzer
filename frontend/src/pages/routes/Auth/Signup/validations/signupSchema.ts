import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  username: z
    .string()
    .min(3, { message: "Username should include at least 3 characters" }),
  password: z
    .string()
    .min(3, { message: "Password should include at least 3 characters" }),
  terms: z.boolean().refine((val) => Boolean(val), {
    message: "Please read and accept the terms and conditions",
  }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
