const { request, response } = require('express');
const { default: mongoose } = require('mongoose');
const Cliente = require('../models/Cliente');
const Contacto = require('../models/Contacto');
const Ingreso = require('../models/Ingreso');
const Pedido = require('../models/Pedido');
const PedidoDetalle = require('../models/PedidoDetalle');
const Prospecto = require('../models/Prospecto');
const Usuario = require('../models/Usuario');
var {FB, FacebookApiException} = require('fb');
const Pusher = require("pusher");
const config = require('../config');
//**************************************** */
const pusher = new Pusher({
    appId: "1515676",
    key: "9cb69b0c52d9af0d8ff3",
    secret: "018d85ef6715f586ec53",
    cluster: "us2",
    useTLS: true
});
// =====_____*****_____***** Método POST :: Estado 1 *****_____*****_____*****=====
const getTest = async( req = request, res = response ) => {
    // const cliente = await Cliente.findOne({ facebookId: '5319732098134729' });
    // const existePedido = await Pedido.find({ cliente: { _id: cliente._id } });
    // console.log(existePedido);
    // const { facebookId } = req.body;
    // const cliente = await Cliente.findOne({ facebookId });
    // const cantidadPedidos = await Pedido.countDocuments({ cliente: cliente._id  });
    // // const cliente = await Cliente.findOne({ facebookId });
    // const prospecto = await Prospecto.findOne({ facebookId });
    // await Prospecto.create({ 
    //     nombre: 'Prueba',
    //     imagen: 'Sinimagen',
    //     correo: 'fer@gmail.com',
    //     celular: '12345',
    //     facebookId: '123',
    //     estado: 1,
    //     posicion: 1
    // });
    // let titulop = "";
    // titulop = `Un nuevo prospecto está registrado`
    // pusher.trigger("actualizar-channel", "actualizar-event", {
    //     titulo: titulop,
    // });
    FB.setAccessToken(`${ config.TOKEN }`);
    var imgURL="http://farm4.staticflickr.com/3332/3451193407_b7f047f4b4_o.jpg";
    //change with your external photo url 
    FB.api('me/photos', 'post', { message:'photo description', url:imgURL }, function(response){
        console.log(response)
        if (!response || response.error) { 
            console.log('Error occured'); 
        } else { 
            console.log('Post ID: ' + response.id); 
        } 
    });
    res.json({ msg: 'creado exitosamente' });
};
module.exports = { getTest };