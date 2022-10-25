const nodemailer = require('nodemailer');
const emailRegistro = async( datos ) => {
    const { email, nombre, token } = datos;
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
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com',
        to: email,
        subject: "Uptask - Comprueba tu Cuenta",
        text: "Comprueba tu cuenta en Uptask",
        html: `
            <p>Hola ${ nombre } Comprueba tu cuenta en uptask</p>
            <p>Tu cuenta ya está lista debes confirmar en el enlace: 
                <a href="${ process.env.FRONT_URL }/confirmar/${ token }">Comprobar tu cuenta </a>
            </p>
            <p>Si tu no creaste ignora esto </p>
        `
    });
};
module.exports = emailRegistro;