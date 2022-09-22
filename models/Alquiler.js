const { Schema, model } = require('mongoose');

const AlquilerSchema = Schema({
    nombre: {
        type: String,
        required: true,
        allowNull: false
    },
    precio: {
        type: String,
        allowNull: true,
        unique: true
    },
    forma: {
        type: String
    }
});

module.exports = model( 'Alquiler', AlquilerSchema );