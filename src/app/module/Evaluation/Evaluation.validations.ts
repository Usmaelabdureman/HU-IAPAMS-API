// Evaluation.validations.ts
import { z } from 'zod';

const createEvaluation = z.object({
  body: z.object({
    application: z.string(),
    evaluator: z.string()
  })
});

const submitEvaluation = z.object({
  body: z.object({
    scores: z.object({
      experience: z.number().min(0).max(10),
      education: z.number().min(0).max(10),
      skills: z.number().min(0).max(10)
    }).optional(),
    comments: z.string().optional(),
    decision: z.enum(['recommended', 'not_recommended', 'pending'])
  })
});

export const EvaluationValidation = { createEvaluation, submitEvaluation };