const nodemailer = require('nodemailer');
const emailRegistro = async( datos ) => {
    const { email, token } = datos;
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "2f8bf846a432c2",
          pass: "a546f901d13fd7"
        }
    });
    // Información del email
    const info = await transport.sendMail({
        from: '"Bot - Administrador" <cuentas@test.com',
        to: email,
        subject: "Bot - Comprueba tu Cuenta",
        text: "Comprueba tu cuenta en Topicos",
        html: `
            <p>Hola Comprueba tu cuenta en bot</p>
            <p>Tu cuenta ya está lista debes confirmar en el enlace: 
                <a href="http://localhost:4000/api/usuario/confirmar/${ token }">Comprobar tu cuenta </a>
            </p>
            <p>Si tu no creaste ignora esto </p>
        `
    });
};
module.exports = emailRegistro;