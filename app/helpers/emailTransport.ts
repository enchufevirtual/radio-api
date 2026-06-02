import nodemailer, { Transporter } from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  frontendUrl: string;
  secure: boolean;
  rejectUnauthorized: boolean;
}

const emailHost = process.env.EMAIL_HOST?.trim() ?? '';
const emailPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 0;
const emailUser = process.env.EMAIL_USER?.trim() ?? '';
const emailPass = process.env.EMAIL_PASS?.trim() ?? '';
const emailFrom = process.env.EMAIL_FROM?.trim() || 'Radio Enchufe Virtual <no-reply@enchufevirtual.com>';
const frontendUrl = process.env.FRONTEND_URL?.trim() ?? '';

if (!emailHost || !emailPort || !emailUser || !emailPass || !frontendUrl) {
  throw new Error(
    'Missing required email configuration. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS and FRONTEND_URL.'
  );
}

if (!/^https?:\/\//i.test(frontendUrl)) {
  throw new Error('FRONTEND_URL must include http:// or https://');
}

export const emailConfig: EmailConfig = {
  host: emailHost,
  port: emailPort,
  user: emailUser,
  pass: emailPass,
  from: emailFrom,
  frontendUrl: frontendUrl.replace(/\/+$/, ''),
  secure: process.env.EMAIL_SECURE === 'true' || emailPort === 465,
  rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== 'false'
};

export const transporter: Transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  },
  tls: {
    rejectUnauthorized: emailConfig.rejectUnauthorized
  }
});
