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
    fecha: {
        type: String
    },
    cantidadSillas: {
        type: String
    },
    cantidadMesas: {
        type: String
    },
    imagen: {
        type: String
    },
    postId: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = model( 'Promocion', PromocionSchema );