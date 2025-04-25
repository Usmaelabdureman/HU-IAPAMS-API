import { z } from 'zod';
import { positionTypes, departments } from './Position.constants';

const createPositionZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'Description is required' }),
    department: z.enum([...departments] as [string, ...string[]], {
      required_error: 'Department is required'
    }),
    positionType: z.enum([...positionTypes] as [string, ...string[]], {
      required_error: 'Position type is required'
    }),
    requirements: z.array(z.string(), { required_error: 'Requirements are required' }),
    deadline: z.string({ required_error: 'Deadline is required' }).transform(str => new Date(str))
  })
});

const updatePositionZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    department: z.enum([...departments] as [string, ...string[]]).optional(),
    positionType: z.enum([...positionTypes] as [string, ...string[]]).optional(),
    requirements: z.array(z.string()).optional(),
    deadline: z.string().transform(str => new Date(str)).optional(),
    status: z.enum(['open', 'closed', 'filled']).optional()
  })
});

export const PositionValidation = {
  create: createPositionZodSchema,
  update: updatePositionZodSchema
};