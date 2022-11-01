const { request, response } = require('express');
const { default: mongoose } = require('mongoose');
const Cliente = require('../models/Cliente');
const Contacto = require('../models/Contacto');
const Ingreso = require('../models/Ingreso');
const Pedido = require('../models/Pedido');
const PedidoDetalle = require('../models/PedidoDetalle');
const Prospecto = require('../models/Prospecto');
const Usuario = require('../models/Usuario');

// =====_____*****_____***** Método POST :: Estado 1 *****_____*****_____*****=====
const getPedido = async( req, res ) => {
    let pedidos = [];
    let total = await Cliente.find();
    let i = 0;
    while ( i < total.length ) {
        let inicial = total[i];
        let [ numeroVeces, fechaUltima ] = await Promise.all([
            Pedido.countDocuments({ cliente: inicial._id }),
            Pedido.find({ cliente: inicial._id }).sort( { $natural: -1 } ).limit( 1 ),
        ]) 
        let objProspecto = {
            cliente: inicial,
            numeroVeces,
            fechaUltima
        };
        pedidos.push( objProspecto );
        i++;
    }
    res.json({ pedidos });
}
const getOneCliente = async( req, res ) => {
    const { id } = req.params;
    const cliente = await Cliente.findOne({ facebookId: id });
    const existePedido = await Pedido.findOne({ cliente: { _id: cliente._id } }).populate('cliente');
    res.json({ existePedido });
    // const pedidoDetalle = await PedidoDetalle.find({ pedido: { _id: existePedido._id } }).populate('pedido');
}
module.exports = { getPedido, getOneCliente };