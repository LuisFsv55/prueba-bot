const { request, response } = require('express');
const { default: mongoose } = require('mongoose');
//const Cliente = require('../models/Cliente');
//const Pedido = require('../models/Pedido');
//const PedidoDetalle = require('../models/PedidoDetalle');

// =====_____*****_____***** Método POST :: Estado 1 *****_____*****_____*****=====
const unreadNotifications = ( req, res ) => {
    let unreadNotification = [
        {
            titulo:"Primer Notificación Christian",
            descripcion:"Una primera notificación que queremos ver"
        },
        {
            titulo:"Segunda Notificación Christian",
            descripcion:"Una segunda notificación que queremos ver"
        },
        {
            titulo:"Tercera Notificación Christian",
            descripcion:"Una tercera notificación que queremos ver"
        },
        {
            titulo:"Cuarta Notificación Christian",
            descripcion:"Una cuarta notificación que queremos ver"
        },

    ]

    res.json({ unreadNotification });
}

module.exports = { unreadNotifications };