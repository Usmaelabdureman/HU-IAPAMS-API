"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const educationSchema = new mongoose_1.Schema({
    institution: { type: String, default: null },
    degree: { type: String, default: null },
    fieldOfStudy: { type: String, default: null },
    startYear: { type: Number, default: null, min: 1900, max: new Date().getFullYear() },
    endYear: {
        type: Number,
        default: null,
        min: 1900,
        max: new Date().getFullYear(),
        validate: {
            validator: function (value) {
                return !this.startYear || value >= this.startYear;
            },
            message: 'End year must be greater than or equal to start year'
        }
    },
    description: { type: String, default: null }
}, { _id: false });
const experienceSchema = new mongoose_1.Schema({
    company: { type: String, default: null },
    position: { type: String, default: null },
    startDate: { type: Date, default: null },
    endDate: {
        type: Date,
        default: null,
        validate: {
            validator: function (value) {
                const parent = this.parent();
                return !parent.startDate || !value || value >= parent.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    current: { type: Boolean, default: false },
    description: { type: String, default: null }
}, { _id: false });
const skillSchema = new mongoose_1.Schema({
    name: { type: String, default: null },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
    }
}, { _id: false });
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'staff', 'evaluator']
    },
    fullName: { type: String, required: function () { return this.role === 'staff'; } },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date },
    phone: { type: String },
    address: { type: String },
    department: { type: String },
    positionType: { type: String },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    // New fields
    profilePhoto: { type: String },
    bio: { type: String },
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [skillSchema],
    socialMedia: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
        linkedIn: { type: String },
        twitter: { type: String },
        github: { type: String }
    },
    website: { type: String }
}, { timestamps: true });
// Hash password before saving
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.salt_rounds));
        next();
    });
});
// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.compare(candidatePassword, this.password);
    });
};
exports.User = mongoose_1.default.model('User', userSchema);
