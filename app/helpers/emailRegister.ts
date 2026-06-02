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

export const emailRegister = async (data: EmailRegisterData): Promise<void> => {
  const { email, name, token } = data;
  const safeName = escapeHtml(name);
  const confirmationUrl = `${emailConfig.frontendUrl}/confirm/${encodeURIComponent(token)}`;

  try {
    await transporter.sendMail({
      from: emailConfig.from,
      to: email,
      subject: 'Verifique y active su cuenta en Radio Enchufe Virtual',
      text: `Hola ${safeName},\n\nGracias por registrarte en Radio Enchufe Virtual. Activa tu cuenta aquí: ${confirmationUrl}\n\nSi no creaste esta cuenta, ignora este mensaje.`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
          <p>Hola ${safeName},</p>
          <p>Gracias por registrarte en Radio Enchufe Virtual. Para activar tu cuenta, por favor haz clic en el botón de abajo:</p>
          <div style="text-align: center;">
            <a href="${confirmationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2196F3; color: #fff; border-radius: 4px; text-decoration: none;">Activar mi cuenta</a>
          </div>
          <p>Si no creaste esta cuenta, por favor ignora este mensaje.</p>
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
    console.error('Email registration failed:', error);
    throw Boom.internal('No se pudo enviar el correo de verificación. Intenta de nuevo más tarde.');
  }
};