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
        type: String,
        required: true
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
    empleado: {
        allowNull: true,
        type: mongoose.Types.ObjectId,
        ref: 'Empleado'
    }
}, {
    timestamps: true
});

module.exports = model( 'Usuario', UsuarioSchema );