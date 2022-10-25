const { Schema, model } = require('mongoose');
const generaIdRandom = require('../helpers/generar');

const ProspectoSchema = Schema({
    nombre: {
        type: String,
        allowNull: false
    },
    imagen: {
        type: String
    },
    correo: {
        type: String
    },
    token: {
        type: String,
        default: generaIdRandom()
    },
    facebookId: {
        allowNull: true,
        type: String
    },
    estado: {
        type: Number,
        default: 1
    },
    posicion: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = model( 'Prospecto', ProspectoSchema );