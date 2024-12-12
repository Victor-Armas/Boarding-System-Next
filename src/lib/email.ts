import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: parseInt(process.env.MAILTRAP_PORT || "587"),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Envía un correo de verificación al usuario.
 * @param to - Dirección de correo electrónico del usuario.
 * @param token - Token único de verificación.
 */
export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/api/verify-email?token=${token}`; // Cambiado para apuntar a la ruta API

  const mailOptions = {
    from: '"Tu Empresa" <no-reply@tuempresa.com>',
    to,
    subject: "Verifica tu correo electrónico",
    text: `Para verificar tu cuenta, haz clic en el siguiente enlace: ${verificationUrl}`,
    html: `
      <html>
        <head>
          <style>
            /* Estilos globales */
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              -webkit-text-size-adjust: none;
              -ms-text-size-adjust: none;
            }
  
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              padding: 20px;
            }
  
            h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
              text-align: center;
            }
  
            p {
              color: #555;
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 20px;
              text-align: center;
            }
  
            .button {
              display: inline-block;
              padding: 12px 25px;
              background-color: #4CAF50;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              text-align: center;
              font-weight: bold;
              transition: background-color 0.3s ease;
              margin: 20px auto;
              display: block;
              width: 200px;
            }
  
            .button:hover {
              background-color: #45a049;
            }
  
            .footer {
              font-size: 14px;
              color: #888;
              text-align: center;
              margin-top: 30px;
            }
  
            .footer a {
              color: #4CAF50;
              text-decoration: none;
            }
  
            /* Media Queries para pantallas pequeñas */
            @media only screen and (max-width: 600px) {
              .email-container {
                padding: 15px;
              }
  
              h1 {
                font-size: 20px;
              }
  
              p {
                font-size: 14px;
              }
  
              .button {
                width: 180px;
                font-size: 14px;
              }
            }
  
            /* Media Queries para pantallas extra pequeñas (como móviles en apaisado) */
            @media only screen and (max-width: 400px) {
              .button {
                width: 150px;
                font-size: 13px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h1>¡Bienvenido a Tu Empresa!</h1>
            <p>Gracias por registrarte. Estamos emocionados de tenerte con nosotros. Para completar tu registro y verificar tu cuenta, haz clic en el siguiente enlace:</p>
            <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
            <p>Si no solicitaste este correo, puedes ignorarlo sin problema.</p>
            <div class="footer">
              <p>Si tienes alguna pregunta, no dudes en <a href="mailto:support@tuempresa.com">contactarnos</a>.</p>
              <p>&copy; ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo de verificación enviado a ${to}:`, info.messageId);
  } catch (error) {
    console.error(`Error al enviar el correo de verificación a ${to}:`, error);
    throw new Error("Error al enviar el correo de verificación.");
  }
}
