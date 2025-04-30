"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationValidation = void 0;
// Evaluation.validations.ts
const zod_1 = require("zod");
const createEvaluation = zod_1.z.object({
    body: zod_1.z.object({
        application: zod_1.z.string(),
        evaluator: zod_1.z.string()
    })
});
const submitEvaluation = zod_1.z.object({
    body: zod_1.z.object({
        scores: zod_1.z.object({
            experience: zod_1.z.number().min(0).max(10),
            education: zod_1.z.number().min(0).max(10),
            skills: zod_1.z.number().min(0).max(10)
        }).optional(),
        comments: zod_1.z.string().optional(),
        decision: zod_1.z.enum(['recommended', 'not_recommended', 'pending'])
    })
});
exports.EvaluationValidation = { createEvaluation, submitEvaluation };
