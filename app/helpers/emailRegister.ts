import nodemailer, { Transporter } from 'nodemailer';

interface EmailRegisterData {
  email: string;
  name: string;
  token: string;
}

export const emailRegister = async (data: EmailRegisterData ): Promise<void> => {

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
    subject: 'Verifique y active su cuenta en Radio Enchufe Virtual',
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
        <p>Hola ${name},</p>
        <p>Gracias por registrarte en Radio Enchufe Virtual. Para activar tu cuenta, por favor haz clic en el botón de abajo:</p>
        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL}/confirm/${token}" style="display: inline-block; padding: 12px 24px; background-color: #2196F3; color: #fff; border-radius: 4px; text-decoration: none;">Activar mi cuenta</a>
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
        <p>Chendo Dev - Jorge Del Pezo</p>
        <p><a href="mailto:chendodev@gmail.com">contacto</a></p>
      </div>
    `
  });
  
}