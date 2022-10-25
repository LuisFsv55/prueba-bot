const { Schema, model, default: mongoose } = require('mongoose');

const ValoracionSchema = Schema({
    opinion: {
        type: String,
        allowNull: true
    },
    estrella: {
        type: Number
    },
    fecha: {
        type: String
    },
    hora: {
        type: String
    },
    cliente: {
        type: mongoose.Types.ObjectId,
        ref: 'Cliente'
    }
}, {
    timestamps: true
});

module.exports = model( 'Valoracion', ValoracionSchema );