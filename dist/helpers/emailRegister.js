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
exports.emailRegister = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const emailTransport_1 = require("./emailTransport");
const escapeHtml = (value) => {
    return String(value).replace(/[&<>",']/g, (char) => {
        var _a;
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return (_a = map[char]) !== null && _a !== void 0 ? _a : char;
    });
};
const emailRegister = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, token } = data;
    const safeName = escapeHtml(name);
    const confirmationUrl = `${emailTransport_1.emailConfig.frontendUrl}/confirm/${encodeURIComponent(token)}`;
    try {
        yield emailTransport_1.transporter.sendMail({
            from: emailTransport_1.emailConfig.from,
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
    }
    catch (error) {
        console.error('Email registration failed:', error);
        throw boom_1.default.internal('No se pudo enviar el correo de verificación. Intenta de nuevo más tarde.');
    }
});
exports.emailRegister = emailRegister;
//# sourceMappingURL=emailRegister.js.map