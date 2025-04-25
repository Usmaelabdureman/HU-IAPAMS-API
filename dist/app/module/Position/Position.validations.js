"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionValidation = void 0;
const zod_1 = require("zod");
const Position_constants_1 = require("./Position.constants");
const createPositionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        description: zod_1.z.string({ required_error: 'Description is required' }),
        department: zod_1.z.enum([...Position_constants_1.departments], {
            required_error: 'Department is required'
        }),
        positionType: zod_1.z.enum([...Position_constants_1.positionTypes], {
            required_error: 'Position type is required'
        }),
        requirements: zod_1.z.array(zod_1.z.string(), { required_error: 'Requirements are required' }),
        deadline: zod_1.z.string({ required_error: 'Deadline is required' }).transform(str => new Date(str))
    })
});
const updatePositionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        department: zod_1.z.enum([...Position_constants_1.departments]).optional(),
        positionType: zod_1.z.enum([...Position_constants_1.positionTypes]).optional(),
        requirements: zod_1.z.array(zod_1.z.string()).optional(),
        deadline: zod_1.z.string().transform(str => new Date(str)).optional(),
        status: zod_1.z.enum(['open', 'closed', 'filled']).optional()
    })
});
exports.PositionValidation = {
    create: createPositionZodSchema,
    update: updatePositionZodSchema
};
