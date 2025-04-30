"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = require("mongoose");
const Application_interfaces_1 = require("./Application.interfaces");
const applicationSchema = new mongoose_1.Schema({
    position: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    applicant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documents: {
        cv: { type: String, required: true },
        coverLetter: { type: String },
        certificates: [{ type: String }]
    },
    status: {
        type: String,
        enum: Object.values(Application_interfaces_1.ApplicationStatus),
        default: Application_interfaces_1.ApplicationStatus.PENDING
    },
    appliedAt: { type: Date, default: Date.now },
    updatedAt: Date
});
exports.Application = (0, mongoose_1.model)('Application', applicationSchema);
