"use strict";
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
exports.sendPasswordResetEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.email_host,
    port: Number(config_1.default.email_port),
    secure: false,
    auth: {
        user: config_1.default.email_user,
        pass: config_1.default.email_pass,
    },
});
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `${config_1.default.email_from_name} <${config_1.default.email_user}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEmail = sendEmail;
const sendPasswordResetEmail = (user, resetUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'Password Reset Request';
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello ${user.fullName || user.username},</p>
      <p>You have requested to reset your password. Please click the button below to reset it:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in ${config_1.default.reset_password_expire} minutes.</p>
      <p>Best regards,<br/>${config_1.default.email_from_name}</p>
    </div>
  `;
    yield (0, exports.sendEmail)({
        email: user.email,
        subject,
        html,
    });
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
