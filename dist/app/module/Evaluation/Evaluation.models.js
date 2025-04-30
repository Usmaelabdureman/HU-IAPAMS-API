"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluation = void 0;
const mongoose_1 = require("mongoose");
const evaluationSchema = new mongoose_1.Schema({
    application: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    evaluator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scores: {
        experience: { type: Number, min: 0, max: 10 },
        education: { type: Number, min: 0, max: 10 },
        skills: { type: Number, min: 0, max: 10 }
    },
    comments: String,
    decision: {
        type: String,
        enum: ['recommended', 'not_recommended', 'pending'],
        default: 'pending'
    },
    evaluatedAt: { type: Date, default: Date.now }
});
exports.Evaluation = (0, mongoose_1.model)('Evaluation', evaluationSchema);
