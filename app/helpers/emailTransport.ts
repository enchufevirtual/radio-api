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

// Log the status of each email environment variable to aid debugging
console.log('[emailTransport] Checking email environment variables:');
console.log(`  EMAIL_HOST      : ${emailHost      ? `"${emailHost}"`      : 'NOT SET'}`);
console.log(`  EMAIL_PORT      : ${emailPort      ? emailPort             : 'NOT SET'}`);
console.log(`  EMAIL_USER      : ${emailUser      ? `"${emailUser}"`      : 'NOT SET'}`);
console.log(`  EMAIL_PASS      : ${emailPass      ? '(set)'               : 'NOT SET'}`);
console.log(`  FRONTEND_URL    : ${frontendUrl    ? `"${frontendUrl}"`    : 'NOT SET'}`);

const missingVars: string[] = [];
if (!emailHost)    missingVars.push('EMAIL_HOST');
if (!emailPort)    missingVars.push('EMAIL_PORT');
if (!emailUser)    missingVars.push('EMAIL_USER');
if (!emailPass)    missingVars.push('EMAIL_PASS');
if (!frontendUrl)  missingVars.push('FRONTEND_URL');

const frontendUrlValid = frontendUrl ? /^https?:\/\//i.test(frontendUrl) : false;
if (frontendUrl && !frontendUrlValid) {
  missingVars.push('FRONTEND_URL (must start with http:// or https://)');
}

/**
 * `true` when all required email variables are present and valid.
 * Consumers should check this flag before attempting to send email.
 */
export const emailConfigured: boolean = missingVars.length === 0;

if (!emailConfigured) {
  console.warn(
    `[emailTransport] Email is DISABLED. Missing or invalid variables: ${missingVars.join(', ')}. ` +
    'The app will start normally but email features will not work until these are set.'
  );
} else {
  console.log('[emailTransport] All email variables present — email is ENABLED.');
}

export const emailConfig: EmailConfig = {
  host: emailHost,
  port: emailPort,
  user: emailUser,
  pass: emailPass,
  from: emailFrom,
  frontendUrl: frontendUrl ? frontendUrl.replace(/\/+$/, '') : '',
  secure: process.env.EMAIL_SECURE === 'true' || emailPort === 465,
  rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== 'false'
};

/**
 * Nodemailer transporter, or `null` when email is not configured.
 * Always check `emailConfigured` before using this.
 */
export const transporter: Transporter | null = emailConfigured
  ? nodemailer.createTransport({
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
    })
  : null;
