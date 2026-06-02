import Boom from '@hapi/boom';
import { emailConfig, transporter } from './emailTransport';

interface EmailRegisterData {
  email: string;
  name: string;
  token: string;
}

const escapeHtml = (value: string): string => {
  return String(value).replace(/[&<>",']/g, (char) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return map[char] ?? char;
  });
};

export const resetPassword = async (data: EmailRegisterData): Promise<void> => {
  const { email, name, token } = data;
  const safeName = escapeHtml(name);
  const resetUrl = `${emailConfig.frontendUrl}/password-reset/${encodeURIComponent(token)}`;

  try {
    await transporter.sendMail({
      from: emailConfig.from,
      to: email,
      subject: 'Restablece tu contraseña',
      text: `Hola ${safeName},\n\nRecibimos una solicitud para restablecer tu contraseña. Usa este enlace para continuar: ${resetUrl}\n\nSi no solicitaste este cambio, ignora este mensaje.`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
          <p>Hola ${safeName},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña en Radio Enchufe Virtual. Haz clic en el botón de abajo para establecer una nueva contraseña:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2196F3; color: #fff; border-radius: 4px; text-decoration: none;">Restablecer mi contraseña</a>
          </div>
          <p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>
          <br>
          <p>Gracias,</p>
          <p>Tu equipo de Radio Enchufe Virtual</p>
          <br>
          <p>--------------------------------------</p>
          <p>¡Que tengas un gran día!</p>
          <p>El equipo de Radio Enchufe Virtual</p>
          <p><b>Desarrollador:</b></p>
          <p>Soy Chendo - Jorge Del Pezo</p>
          <p><a href="mailto:chendoec@gmail.com">contacto</a></p>
        </div>
      `
    });
  } catch (error) {
    console.error('Password reset email failed:', error);
    throw Boom.internal('No se pudo enviar el correo para restablecer la contraseña. Intenta de nuevo más tarde.');
  }
};