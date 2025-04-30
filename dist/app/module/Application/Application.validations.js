"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationValidation = void 0;
// Application.validations.ts
const zod_1 = require("zod");
const createApplication = zod_1.z.object({
    body: zod_1.z.object({
        position: zod_1.z.string(),
        documents: zod_1.z.object({
            cv: zod_1.z.string(),
            coverLetter: zod_1.z.string().optional(),
            certificates: zod_1.z.array(zod_1.z.string()).optional()
        })
    })
});
exports.ApplicationValidation = { createApplication };
