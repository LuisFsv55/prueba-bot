const { Schema, model, default: mongoose } = require('mongoose');

const PedidoDetalleSchema = Schema({
    cantidad: {
        type: Number
    },
    precio: {
        type: Number
    },
    sub_total: {
        type: Number,
        allowNull: true
    },
    producto: {
        type: mongoose.Types.ObjectId,
        ref: 'Producto'
    },
    pedido: {
        type: mongoose.Types.ObjectId,
        ref: 'Pedido'
    }
}, {
    timestamps: true
});

module.exports = model( 'PedidoDetalle', PedidoDetalleSchema );