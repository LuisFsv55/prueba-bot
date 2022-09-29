const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        allowNull: false
    },
    precio: {
        type: String,
        allowNull: true
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