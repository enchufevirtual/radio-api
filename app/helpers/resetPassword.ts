import nodemailer, { Transporter } from 'nodemailer';

interface EmailRegisterData {
  email: string;
  name: string;
  token: string;
}

export const resetPassword = async (data: EmailRegisterData ): Promise<void> => {

  const transporter: Transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST ?? '',
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 0,
    auth: {
      user: process.env.EMAIL_USER ?? '',
      pass: process.env.EMAIL_PASS ?? ''
    }
  });

  const { email, name, token } = data;

  // Send Email
  await transporter.sendMail({
    from: "Radio - Enchufe Virtual <enchufevirtual.com>",
    to: email,
    subject: 'Restablece tu contraseña',
    text: 'Restablece tu contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
        <p>Hola ${name},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña en Radio Enchufe Virtual. Haz clic en el botón de abajo para establecer una nueva contraseña:</p>
        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL}/#/password-reset/${token}" style="display: inline-block; padding: 12px 24px; background-color: #2196F3; color: #fff; border-radius: 4px; text-decoration: none;">Restablecer mi contraseña</a>
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
        <p>Chendo Dev - Jorge Del Pezo</p>
        <p><a href="mailto:chendodev@gmail.com">contacto</a></p>
      </div>
    `
  });
  
}