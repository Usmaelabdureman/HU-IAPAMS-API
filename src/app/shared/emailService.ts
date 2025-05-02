import nodemailer from 'nodemailer';
import config from '../config';

interface IMailOptions {
  email: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: config.email_host,
  port: Number(config.email_port),
  secure: false,
  auth: {
    user: config.email_user,
    pass: config.email_pass,
  },
});

export const sendEmail = async (options: IMailOptions): Promise<void> => {
  const mailOptions = {
    from: `${config.email_from_name} <${config.email_user}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (user: any, resetUrl: string): Promise<void> => {
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
      <p>This link will expire in ${config.reset_password_expire} minutes.</p>
      <p>Best regards,<br/>${config.email_from_name}</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject,
    html,
  });
};