const { Schema, model, default: mongoose } = require('mongoose');

const PedidoSchema = Schema({
    fecha: {
        type: String
    },
    hora: {
        type: String
    },
    monto: {
        type: Number,
        allowNull: true
    },
    cliente: {
        type: mongoose.Types.ObjectId,
        ref: 'Cliente'
    },
    confirmado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = model( 'Pedido', PedidoSchema );