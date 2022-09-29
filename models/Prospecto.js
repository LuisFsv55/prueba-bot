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
        type: String,
        allowNull: true
    },
    token: {
        type: String,
        default: generaIdRandom()
    },
    celular: {
        type: String
    },
    facebookId: {
        allowNull: true,
        type: String
    }
}, {
    timestamps: true
});

module.exports = model( 'Prospecto', ProspectoSchema );