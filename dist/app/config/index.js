"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    mongodb_uri: process.env.MONGODB_URI,
    salt_rounds: process.env.PASSWORD_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET || "plCyCNec9l1L_HzcUEdhN7OQrUWgo3VO7C9-GQrnbvQ",
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "1cIsp1tlnEIMs9CabFPeR5jJ15kiYTZ2LiYCPZUUPpc",
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    email_host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    email_port: process.env.EMAIL_PORT || 587,
    email_user: process.env.EMAIL_USER || 'drmteam.sup@gmail.com',
    email_pass: process.env.EMAIL_PASS || 'ghkt efru hmgw yjgm',
    email_from_name: process.env.EMAIL_FROM_NAME || 'Haramaya University HRMS',
    reset_password_expire: process.env.RESET_PASSWORD_EXPIRE || 10,
    client_url: process.env.CLIENT_URL || 'https://hu-iapms.vercel.app/',
    supabase_url: process.env.SUPABASE_URL,
    supabase_anon_key: process.env.SUPABASE_ANON_KEY,
};
