"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const registerValidation = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3).max(20),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
        role: zod_1.z.enum(['admin', 'applicant', 'evaluator']),
        fullName: zod_1.z.string().min(1).max(50).optional()
    })
});
const loginValidation = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3).max(20),
        password: zod_1.z.string().min(8)
    })
});
exports.AuthValidation = {
    register: registerValidation,
    login: loginValidation
};
