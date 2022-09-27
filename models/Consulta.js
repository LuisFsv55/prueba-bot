const { Schema, model, default: mongoose } = require('mongoose');

const ConsultaSchema = Schema({
    producto: {
        type: mongoose.Types.ObjectId,
        ref: 'Producto'
    },
    cliente: {
        type: mongoose.Types.ObjectId,
        ref: 'Cliente'
    }
}, {
    timestamps: true
});

module.exports = model( 'Consulta', ConsultaSchema );