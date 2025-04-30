// Application.validations.ts
import { z } from 'zod';

const createApplication = z.object({
  body: z.object({
    position: z.string(),
    documents: z.object({
      cv: z.string(),
      coverLetter: z.string().optional(),
      certificates: z.array(z.string()).optional()
    })
  })
});

export const ApplicationValidation = { createApplication };