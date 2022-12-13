const { Schema, model, default: mongoose } = require('mongoose');
const NotificacionesSchema = Schema({
    cliente: {
        type: mongoose.Types.ObjectId,
        ref: 'Cliente'
    },
    fecha: {
        allowNull: false,
        type: String
    },
    promocion: {
        type: mongoose.Types.ObjectId,
        ref: 'Promocion'
    },
    read : {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = model( 'Notificaciones', NotificacionesSchema );