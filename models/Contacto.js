const { Schema, model, default: mongoose } = require('mongoose');

const ContactoSchema = Schema({
    contactar: {
        type: String,
        allowNull: false
    },
    medio: {
        type: String,
        allowNull: false
    },
    mensaje: {
        type: String,
        allowNull: false
    },
    fecha: {
        type: String,
        allowNull: false
    },
    hora: {
        type: String,
        allowNull: false
    },
    idPros: {
        type: mongoose.Types.ObjectId,
        ref: 'Prospecto'
    },
    usuario: {
        type: mongoose.Types.ObjectId,
        ref: 'Usuario'
    }
}, {
    timestamps: true
});

module.exports = model( 'Contacto', ContactoSchema );