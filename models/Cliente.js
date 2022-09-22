const { Schema, model } = require('mongoose');
const generaIdRandom = require('../helpers/generar');

const ClienteSchema = Schema({
    nombre: {
        type: String,
        required: true,
        allowNull: false
    },
    celular: {
        type: String,
        allowNull: true,
        unique: true
    },
    token: {
        type: String,
        default: generaIdRandom()
    }
}, {
    timestamps: true
});

module.exports = model( 'Cliente', ClienteSchema );