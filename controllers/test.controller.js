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
    const { facebookId } = req.body;
    const cliente = await Cliente.findOne({ facebookId });
    const prospecto = await Prospecto.findOne({ facebookId });
    res.json({ prospecto });
};
module.exports = { getTest };