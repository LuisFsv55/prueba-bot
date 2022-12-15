const Cliente = require("../models/Cliente");
const Detalle = require("../models/Detalle");
const Notificaciones = require("../models/Notificaciones");
const Producto = require("../models/Producto");
var {FB, FacebookApiException} = require('fb');
const fs = require('fs-extra');
const { uploadImage } = require("../helpers/cloudinary");
const Promocion = require("../models/Promocion");
const config = require("../config");
const axios = require('axios')
const obtenerTodos = async( req, res ) => {
    const detalle = await Detalle.find().populate('producto').populate('promocion').where();
    res.json({
        detalle
    });
}
const crearPromo = async( req, res ) => {

    const { nombre, descuento, descripcion, cantidadSillas, cantidadMesas, producto, imagen } = req.body;

    let post_id = "";
    FB.setAccessToken(`${ config.TOKEN }`);
    var imgURL=`${ imagen }`;
    //change with your external photo url 
    FB.api('me/photos', 'post', { message:'photo description', url:imgURL }, async response => {  
        if (!response || response.error) { 
            console.log('Error occured'); 
        } else { 
            post_id = response.id
            console.log('Post ID: ' + response.id); 
        } 
        const fecha = new Date().toLocaleDateString('es-ES', {
            timeZone: 'America/La_Paz',
        });
        const nuevaPromocion = new Promocion({
            nombre, 
            descuento,
            descripcion,
            fecha,
            cantidadSillas,
            cantidadMesas,
            imagen,
            postId: post_id
        });
        await nuevaPromocion.save();
        const detallePromocion = new Detalle({
            producto,
            promocion: nuevaPromocion._id
        });
        await detallePromocion.save();
    });

   
   
    res.json({
        msg: 'creado exitosamente',
        // nuevaPromocion,
        // url
    })
}
const eliminarPromo = async( req, res ) => {
    const { id } = req.params;
    const detalle = await Detalle.findOne({ _id: id });
    const promocion = await Promocion.findOne({ _id: detalle.promocion });


    FB.setAccessToken(`${ config.TOKEN }`);
    var postId = promocion.postId;
    FB.api(postId, 'delete', function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log('Post was deleted');
    });
    await detalle.deleteOne();
    await promocion.deleteOne();
    res.json({
        msg: 'Eliminado con exito'
    });
}
const obtenerProducto = async( req, res ) => {
    const productos = await Producto.find();
    res.json({
        productos
    })
}
const nofificar = async( req, res ) => {
    let [ promocion ] = await Promise.all([
        Promocion.findOne().sort( { $natural: -1 } ).limit( 1 )
    ]) 
    let total = await Cliente.find().populate('idPros');
    let i = 0;
    while ( i < total.length ) {
        let cliente = total[i];
        if ( cliente.idPros.estado === 4 ) {
            await Notificaciones.create({
                cliente: cliente._id,
                fecha: new Date().toLocaleString('es-ES', {
                    timeZone: 'America/La_Paz',
                }),
                promocion: promocion._id
            })
        }
        i++;
    }
    res.json({ msg: 'Notificaco exitosamente' });
}
const notificacionUltima = async( req, res ) => {
    let promocion = await Promocion.findOne().sort( { $natural: -1 } ).limit( 1 );
    let detalle = await Detalle.findOne({ promocion: promocion._id }).populate('promocion').populate('producto');
    
    let total = await Cliente.find().populate('idPros');
    let clientes = [];
    let i = 0;
    while ( i < total.length ) {
        let inicial = total[i];
        if ( inicial.idPros.estado === 4 ) {
            let obj = {
                correo: inicial.idPros.correo
            }
            clientes.push( obj );
        }
        i++;
    }
    const mas = clientes.length;

    res.json({
        detalle,
        clientes
    });
}
module.exports = {
    obtenerTodos, crearPromo, eliminarPromo, obtenerProducto, nofificar, notificacionUltima
}