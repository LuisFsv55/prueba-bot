const { Schema, model } = require('mongoose');

const SucursalSchema = Schema({
    departamento: {
        type: String,
        required: true,
        allowNull: false
    },
    municipio: {
        type: String,
        required: true,
        allowNull: false
    },
    barrio: {
        type: String,
        allowNull: true,
        unique: true
    },
    calle: {
        type: String,
        allowNull: true,
        unique: true
    },
    numero: {
        type: String,
        allowNull: true,
        unique: true
    }
});

module.exports = model( 'Sucursal', SucursalSchema );