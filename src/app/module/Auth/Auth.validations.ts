import { z } from 'zod';

const registerValidation = z.object({
  body: z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
    role: z.enum(['admin', 'applicant', 'evaluator']),
    fullName: z.string().min(1).max(50).optional()
  })
});

const loginValidation = z.object({
  body: z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(8)
  })
});

export const AuthValidation = {
  register: registerValidation,
  login: loginValidation
};