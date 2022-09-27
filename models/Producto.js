const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
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
    },
    imagen: {
        type: String,
        url: String,
        public_id: String
    }
});

module.exports = model( 'Producto', ProductoSchema );