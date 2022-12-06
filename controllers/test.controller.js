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
const getTest = async( req = request, res = response ) => {
    const cliente = await Cliente.findOne({ facebookId: '5319732098134729' });
    const existePedido = await Pedido.find({ cliente: { _id: cliente._id } });
    console.log(existePedido);
    // const { facebookId } = req.body;
    // const cliente = await Cliente.findOne({ facebookId });
    // const cantidadPedidos = await Pedido.countDocuments({ cliente: cliente._id  });
    // // const cliente = await Cliente.findOne({ facebookId });
    // const prospecto = await Prospecto.findOne({ facebookId });
    res.json({ ultimo: existePedido[existePedido.length - 1] });
};
module.exports = { getTest };