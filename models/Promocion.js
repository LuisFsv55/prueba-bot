const { Schema, model } = require('mongoose');

const PromocionSchema = Schema({
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
    descripcion: {
        type: String,
        required: true,
        allowNull: false
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = model( 'Promocion', PromocionSchema );