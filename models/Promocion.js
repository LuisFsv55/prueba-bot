const { Schema, model } = require('mongoose');

const PromocionSchema = Schema({
    nombre: {
        type: String,
        allowNull: true
    },
    descuento: {
        type: String
    },
    descripcion: {
        type: String,
        allowNull: true
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = model( 'Promocion', PromocionSchema );