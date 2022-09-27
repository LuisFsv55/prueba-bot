const { Schema, model, default: mongoose } = require('mongoose');

const DetalleSchema = Schema({
    producto: {
        type: mongoose.Types.ObjectId,
        ref: 'Producto'
    },
    promocion: {
        type: mongoose.Types.ObjectId,
        ref: 'Promocion'
    },
    fechaInicio: {
        type: Date
    },
    fechaFin: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = model( 'Detalle', DetalleSchema );