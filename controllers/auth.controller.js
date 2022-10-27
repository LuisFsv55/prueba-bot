const Usuario = require('../models/Usuario');
const Generar = require('../helpers/generar');
const generarJWT = require('../helpers/generarJWT');
const emailRegistro = require('../helpers/email');
const bcryptjs = require('bcryptjs');
const Persona = require('../models/Persona');

// =====_____*****_____***** Método POST :: crear usuario *****_____*****_____*****=====
const registrar = async( req, res ) => {
    const { email, password, nombre, celular, direccion } = req.body;
    
    // 1. Evitar registros duplicados, usuario ya registrado
    const existe = await Usuario.findOne({ email });
    if ( existe ) {
        const error = new Error('Usuario ya está registrado');
        return res.status( 400 ).json({ msg: error.message });
    }
    try {
        const persona = new Persona( { nombre, celular, direccion } );
        const usuario = new Usuario( req.body );
        usuario.token = Generar();
        usuario.tipo = 'Empleado';
        usuario.persona = persona._id;
        // Encriptar
        const salt = bcryptjs.genSaltSync( 10 );
        usuario.password = bcryptjs.hashSync( password, salt )
        await usuario.save();
        await persona.save();
        // Enviar el email
        // emailRegistro( {
        //     email: usuario.correo,
        //     token: usuario.token
        // });
        res.json({ 
            msg: 'Usuario creado exitosamente, revisa tu correo para confirmar tu cuenta'
        });
    } catch (error) {
        // const error = new Error('Usuario ya está registrado');
        return res.status( 400 ).json({ msg: error.message });
    }
}
// =====_____*****_____***** Método POST :: autenticar usuario *****_____*****_____*****=====
const autenticar = async(req, res) => {
    const { correo, password } = req.body;
    // 1. Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ correo });
    if ( !usuario ) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
    }
    // 2. Comprobar si el usuario está activo
    if ( !usuario.estado ) {
        const error = new Error('Usuario no está activo');
        return res.status(404).json({ msg: error.message });
    }
    // 3. Comprobar si el usuario está confirmado
    if ( !usuario ) {
        const error = new Error('Tu correo no fue confirmada');
        return res.status(403).json({ msg: error.message });
    }
    // 4. Comprobar su password
    const validarPassword = bcryptjs.compareSync( password, usuario.password );
    if ( validarPassword ) {
        const {persona} = await Usuario.findOne({ correo }).populate('persona');
        res.json({
            _id: usuario._id,
            nombre: persona.nombre,
            celular: persona.celular,
            direccion: persona.direccion,
            correo: usuario.correo,
            token: generarJWT( usuario._id )
        });
    } else {
        const error = new Error('Tu contraseña es incorrecta');
        return res.status(403).json({ msg: error.message });
    }

};
// =====_____*****_____***** Método GET :: confirmar cuenta *****_____*****_____*****=====
const confirmar = async(req, res) => {
    const { token } = req.params;
    // 1. Buscar al usuario con el token de envío
    const usuarioConfirmar = await Usuario.findOne({ token });
    if ( !usuarioConfirmar ) {
        const error = new Error('Token no válido');
        return res.status(403).json({ msg: error.message });
    }
    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({ msg: 'Usuario confirmado correctamente' })
    } catch (error) {
        console.log(error);
    }

};
module.exports = { autenticar, registrar, confirmar };