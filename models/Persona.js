const { Schema, model } = require('mongoose');

const PersonaSchema = Schema({
    nombre: {
        type: String,
        allowNull: false
    },
    celular: {
        type: Number
    },
    direccion: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = model( 'Persona', PersonaSchema );