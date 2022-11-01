const { Schema, model, default: mongoose } = require('mongoose');

const UsuarioSchema = Schema({
    correo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tipo: {
        type: String
    },
    token: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    },
    persona: {
        allowNull: true,
        type: mongoose.Types.ObjectId,
        ref: 'Persona'
    }
}, {
    timestamps: true
});
UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, confirmado, token, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );