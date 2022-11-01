const Cliente = require("../models/Cliente");
const Sucursal = require("../models/Sucursal");
const Promocion = require("../models/Promocion");
const Producto = require("../models/Producto");
const Consulta = require("../models/Consulta");
const Valoracion = require("../models/Valoracion");
const Detalle = require("../models/Detalle");
const Prospecto = require("../models/Prospecto");
const config = require("../config");
const axios = require('axios');
const Ingreso = require("../models/Ingreso");
const request = require('request');
const Pedido = require("../models/Pedido");
const PedidoDetalle = require("../models/PedidoDetalle");
const controllerDialogFlow = async( resultado, senderId ) => {
    let peticion = {};
    let respuesta;
    ApiFacebook( senderId );
    switch (resultado.intent.displayName) {
        case 'Saludo':
            respuesta = await Saludo( resultado, senderId );
            peticion = await envio( respuesta, senderId )
            break;
        case 'Promocion': 
            respuesta = await Promociones( resultado.fulfillmentText );
            peticion = await envio( respuesta, senderId )
            break;
        case 'Sucursales': 
            respuesta = await Sucursales( resultado.fulfillmentText );
            peticion = await envio( respuesta, senderId )
            break;
        case 'Sillas':
            respuesta = await Sillas( resultado.fulfillmentText, senderId );
            peticion = await envio( respuesta, senderId )
            break;
        case 'Mesas':
            respuesta = await Mesas( resultado, senderId );
            peticion = await envio( respuesta, senderId )
            break;
        case 'Precios':
            respuesta = await Precios( resultado.fulfillmentText, senderId );
            peticion = await envio( respuesta, senderId )
            break;
        case 'pedirTelefono':
            respuesta = await PedirNombreCelular( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'formaMesaCuadrada':
            respuesta = await formaMesaCuadrada( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'formaMesaCircular':
            respuesta = await formaMesaCircular( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'PedidoSillas':
            respuesta = await PedidoSillas( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'Valoracion':
            respuesta = await valor( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'CorreoRegistrado':
            respuesta = await CorreoProspecto( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'cantidadSillas':
            respuesta = await carrito( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'NoConfirmacion':
            respuesta = await noConfirmacion( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'Confirmacion':
            respuesta = await confirmacion( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'NoConfirmarCarrito':
            respuesta = await noConfirmarCarrito( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'PedirNombre1':
            respuesta = await pedirNombre( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        case 'correoCliente':
            respuesta = await correoCliente( resultado, senderId );
            peticion = await envio( respuesta, senderId );
            break;
        default:
            peticion = await envio( resultado.fulfillmentText, senderId );
            break;
    }
    return peticion;
}
const Saludo = async( resultado, facebookId ) => {
    const prospecto = await Prospecto.findOne({ facebookId });
    console.log("prospecto" + prospecto)
    let listar = ''
    if ( prospecto ) {
        listar = `Hola Buenas ${ prospecto.nombre } ¿Usted necesita información o saber detalles de alquiler de mesas y silla?`
    } else {
        listar = "Hola Buenas ¿Usted necesita información o saber detalles de alquiler de mesas y silla?";
    }
    return listar;
}
const valor = async( resultado, facebookId ) => {
    try {
        // console.log(resultado.queryText);
        // console.log(resultado.outputContexts);
        const comentario = resultado?.queryText;
        // console.log("comentario" + comentario)
        const cliente = await Cliente.findOne({ facebookId });
        const registrar = new Valoracion( { opinion: comentario, cliente  } );
        registrar.save();
        console.log('------- Valoracion creada -------' + Cliente)
    } catch (error) {
        console.log('Error al insertar en la db: ' + error);
    }
    return resultado.fulfillmentText;
}
const CorreoProspecto = async( resultado, facebookId ) => {
    const prospecto = await Prospecto.findOne({ facebookId });
    prospecto.correo = resultado.queryText;
    prospecto.save();
    return resultado.fulfillmentText;
}
const Promociones = async( resultado ) => {
    const detalle = await Detalle.find().populate('producto').populate('promocion');
    // console.log(detalle)
    let strPromos = `Las promociones de este mes:`;
    detalle.forEach( (pro, index) => {
        strPromos = strPromos + `\n *⌛ ${ pro.promocion.nombre } de ${ pro.promocion.cantidadMesas } ${ pro.producto.nombre }s ${ pro.producto.forma } con ${ pro.promocion.cantidadSillas } Sillas a ${ pro.promocion.descuento }Bs`;
    });
    strPromos = strPromos + `\n ¿Quisiera un pedido de algun juego?`;
    return strPromos;
}
const formaMesaCuadrada = async( resultado, facebookId ) => {
    const producto = await Producto.findOne({ forma: 'cuadrada' });
    const prospecto = await Prospecto.findOne({ facebookId });
    if ( prospecto && producto ) {
        console.log('entro aqui');
        await Consulta.create({ producto, prospecto });
    }
    return resultado.fulfillmentText;
}
const formaMesaCircular = async( resultado, facebookId ) => {
    console.log('mesa cuadrada');
    const producto = await Producto.findOne({ forma: 'redonda' });
    const prospecto = await Prospecto.findOne({ facebookId });
    if ( prospecto && producto ) {
        console.log('entro aqui');
        await Consulta.create({ producto, prospecto });
    }
    return resultado.fulfillmentText;
}
const PedidoSillas = async( resultado, facebookId ) => {
    const producto = await Producto.findOne({ nombre: 'silla' });
    const prospecto = await Prospecto.findOne({ facebookId });
    if ( prospecto && producto ) {
        await Consulta.create({ producto, prospecto });
    }
    return resultado.fulfillmentText;
}
const PedirNombreCelular = async( resultado, facebookId ) => {
    try {

        // console.log(resultado.outputContexts[0].parameters.fields);
        // console.log(resultado.outputContexts[1].parameters.fields);
        // const nombre = resultado?.outputContexts[1].parameters.fields.any.stringValue;
        // const celular = resultado?.outputContexts[1].parameters.fields.number.numberValue;
        // const cliente = await Cliente.findOne({ facebookId: `${facebookId}` });
        // const usuario = await Prospecto.findOne({ facebookId });
        // if ( cliente ) {
        //     await cliente.updateOne( { nombre, celular } );
        // } else {
        //     const registrar = new Cliente( { nombre, celular, facebookId, idPros: usuario._id  } );
        //     registrar.save();
        // }
        // console.log('------- Cliente creado -------' + Cliente)
        const cliente = await Cliente.findOne({ facebookId });
        cliente.celular = resultado?.queryText;
        cliente.save();
        return resultado.fulfillmentText;
    } catch (error) {
        console.log('Error al insertar en la db: ' + error);
    }
    return resultado.fulfillmentText;
}
const Precios = async( resultado, facebookId ) => {
    let imagenesMostrar = [];
    const obtenerTodosAlquileres = await Producto.find();
    let listar = 'Los precios de alquileres de sillas y mesas son los siguientes: ';
    obtenerTodosAlquileres.forEach( pro => {
        // console.log("Productos: " + pro);
        imagenesMostrar.push({ url: pro.imagen });
        if ( pro.nombre === 'silla' ) {
            listar = listar + `\n * 10 ${pro.nombre} a ${pro.precio}Bs`;
        } else {
            if ( pro.forma === 'cuadrada' ) {
                listar = listar + `\n * 5 ${pro.nombre}s de forma ${pro.forma} a ${pro.precio} Bs`;
            } else {
                listar = listar + `\n * 5 ${pro.nombre}s de forma ${pro.forma} a ${pro.precio} Bs`;
            }
        }
    });
    listar = listar + `\n ¿Quisiera realizar un pedido de mesas o sillas?`;
    await envioImagen( imagenesMostrar, facebookId );
    return listar;
}
const envioImagen = async( imagenes, id ) => {
    await imagenes.forEach( img => {
        request({
            uri: 'https://graph.facebook.com/v14.0/me/messages',
            qs: { access_token: config.FB_PAGE_TOKEN },
            method: 'POST',
            json: {
                recipient: {
                    id
                },
                message: {
                    attachment: {
                        type: 'image',
                        payload: {
                            url: img.url,
                            is_reusable: true
                        }
                    }
                }
            }
        }, (err, res, body) => {
            if (!err) {
                console.log('Al fin')
            } else {
                console.log('Nada' + err);
            }
        })
    })
}
const Sillas = async( resultado, facebookId ) => {
    const obtenerSilla = await Producto.find();
    const producto = await Producto.findOne({ nombre: 'silla' });
    const prospecto = await Prospecto.findOne({ facebookId });
    let listar = '';
    let imagenSilla = [];
    obtenerSilla.forEach( alquiler => {
        if ( alquiler.nombre === 'silla' ) {
            imagenSilla.push( { url: alquiler.imagen } )
            listar = listar + `\n 🪑Las sillas están a un precio de: \n 10 sillas a ${alquiler.precio}Bs. \n¿Quisiera realizar un pedido?`;
        }
    });
    if ( producto && prospecto ) {
        await Consulta.create({ producto, prospecto });
    }
    await envioImagen( imagenSilla, facebookId );
    return listar;
}
const Mesas = async( resultado, facebookId ) => {
    const producto = await Producto.findOne({ forma: 'cuadrada' });
    const producto1 = await Producto.findOne({ forma: 'redonda' });
    const prospecto = await Prospecto.findOne({ facebookId });
    const obtenerMesas = await Producto.find();
    let mesasImagenes = [];
    let listar = 'El precio de las mesas son los siguientes: ';
    obtenerMesas.forEach( alquiler => {
        if ( alquiler.forma === 'cuadrada' || alquiler.forma === 'redonda' ) {
            mesasImagenes.push({ url: alquiler.imagen } );
            listar = listar + `\n * 5 ${alquiler.nombre}s de forma ${alquiler.forma} a ${alquiler.precio}Bs`;
        }
    });
    if ( prospecto && producto ) {
        await Consulta.create({ producto, prospecto });
        await Consulta.create({ producto1, prospecto });
    }
    listar = listar + '\n ¿Quisiera realizar un pedido?';
    await envioImagen( mesasImagenes, facebookId );
    return listar;
}
const Sucursales = async() => {
    const obtenerTodosSucursal= await Sucursal.find();
    let listar = 'Las sucursales de la tienda son: ';
    obtenerTodosSucursal.forEach( sucur => {
        
        listar = listar + `\n * 🏠${ sucur.departamento }, ${ sucur.municipio }, Barrio: ${sucur.barrio}, Calle: ${sucur.calle}, número: ${sucur.numero}`;
         
    });
    return listar;
}
// 2022-10-25T15:08:50.450053+00:00 app[web.1]: { numberValue: 10, kind: 'numberValue' }
// 
// 2022-10-25T15:08:50.450098+00:00 app[web.1]: { stringValue: 'silla', kind: 'stringValue' }
const carrito = async( resultado, facebookId ) => {
    // 1. Dato de dialogflow
    let cantidad = await parseInt( resultado.outputContexts[2].parameters.fields.number.numberValue );
    
    // console.log('--------------------------producto-----------------');
    let producto = resultado.outputContexts[2].parameters.fields.Formas.stringValue;
    // console.log(producto)
    let productoDB = await Producto.findOne({ forma: producto });
    // console.log('--------------------------producto-----------------');
    let carrito;
    let cliente = await Cliente.findOne({ facebookId });
    let prospecto = await Prospecto.findOne({ facebookId });
    if ( !productoDB ) {// es mesa
        productoDB = await Producto.findOne({ nombre: "silla" });        
    }
    // 2. Verificar si es cliente por 1ra vez y crearlo un cliente
    if ( !cliente ) {
        cliente = await Cliente.create({
            nombre: prospecto.nombre,
            facebookId: prospecto.facebookId,
            idPros: prospecto._id
        });
    }
    // 3. Encontramos cliente y prospecto: encontrar pedido anterior
    if ( cliente ) {
        // encontramos el anterior carrito
        carrito = await Pedido.findOne({ cliente: cliente._id, confirmado: false });
    }
    // crear nuevo carrito
    if ( !carrito ) {
        const fecha = new Date().toLocaleDateString('es-ES', {
            timeZone: 'America/La_Paz',
        });
        // console.log(fecha)
        const hora = new Date().toLocaleTimeString('es-ES', {
            timeZone: 'America/La_Paz',
        });
        // console.log(hora);
        carrito = await Pedido.create({
            monto: 0,
            fecha, 
            hora,
            cliente: cliente._id
            // confirmado por defecto false
        });
    }
    // detalle del pedido
    let subTotal = cantidad * parseInt( productoDB.precio );
    await PedidoDetalle.create({
        cantidad,
        precio: parseInt( productoDB.precio ),
        sub_total: subTotal,
        producto: productoDB._id,
        pedido: carrito._id
    });
    // TODO: ACTUALIZAR MONTO
    let montoCarrito = parseInt( carrito.monto ) + subTotal;
    await Pedido.findByIdAndUpdate( { _id: carrito._id }, { monto: montoCarrito } );
    // console.log('---------------Inicio carrito --------------');
    // console.log(carrito);
    // console.log(subTotal);
    // console.log(montoCarrito);
    // console.log('---------------Fin carrito --------------');
    
    
    
    // console.log(resultado.outputContexts[2].parameters.fields.number.numberValue);
    // console.log(resultado.outputContexts[2].parameters.fields.Formas.stringValue);
    return resultado.fulfillmentText;
};
// {
//   _id: new ObjectId("635dd05300a3eefef123833d"),
//   fecha: '10/30/2022',
//   hora: '1:16:03 AM',
//   monto: 500,
//   cliente: {
//     _id: new ObjectId("635dd05300a3eefef123833a"),
//     nombre: 'Nano Vargas',
//     idPros: new ObjectId("63583cb87eaab3514c91310a"),
//     facebookId: '5319732098134729',
//     createdAt: 2022-10-30T01:16:03.720Z,
//     updatedAt: 2022-10-30T01:16:03.720Z,
//     __v: 0
//   },
//   confirmado: false,
//   createdAt: 2022-10-30T01:16:03.729Z,
//   updatedAt: 2022-10-30T01:16:03.741Z,
//   __v: 0
// }
const noConfirmacion = async( resultado, facebookId ) => {
    const cliente = await Cliente.findOne({ facebookId });
    const existePedido = await Pedido.findOne({ cliente: { _id: cliente._id } }).populate('cliente');
    let mensaje = `Su carrito tiene la suma total de: ${ existePedido.monto }$ quiere confirmar su carrito?`;
    return mensaje;
};
const confirmacion = async( resultado, facebookId ) => {
    const cliente = await Cliente.findOne({ facebookId });
    const existePedido = await Pedido.find({ cliente: cliente._id }).sort( { $natural: -1 } ).limit( 1 );
    console.log('--------------confirmar');
    console.log(existePedido)
    // existePedido.confirmado = true;
    // existePedido.save();
    console.log('--------------confirmar');
    return resultado.fulfillmentText;
}
const pedirNombre = async( resultado, facebookId ) => {
    const cliente = await Cliente.findOne({ facebookId });
    cliente.nombre = resultado?.queryText;
    cliente.save();
    return resultado.fulfillmentText;
}
const correoCliente = async( resultado, facebookId ) => {
    const cliente = await Cliente.findOne({ facebookId });
    cliente.correo = resultado?.queryText;
    cliente.save();
    return resultado.fulfillmentText;
}
const noConfirmarCarrito = async( resultado, facebookId ) => {
    const cliente = await Cliente.findOne({ facebookId });
    const existePedido = await Pedido.findOne({ cliente: { _id: cliente._id } }).populate('cliente');
    const pedidoDetalle = await PedidoDetalle.find({ pedido: { _id: existePedido._id } }).populate('pedido');
    // console.log('------------detalle')
    // console.log(pedidoDetalle);
    pedidoDetalle.forEach(async pedido => {
        await PedidoDetalle.findByIdAndDelete( pedido._id )
    });
    await Pedido.findByIdAndDelete( existePedido._id  );
    return resultado.fulfillmentText;
}
const ApiFacebook = async( facebookId ) => {
    const url = `https://graph.facebook.com/v15.0/${ facebookId }?fields=first_name,last_name,profile_pic&access_token=${ config.FB_PAGE_TOKEN }`;
    const { data } = await axios.get( url );
    const usuario = await Prospecto.findOne({ facebookId });
    if ( !usuario ) {
        await Prospecto.create({ 
            nombre: data.first_name + " "  + data.last_name,
            imagen: data.profile_pic,
            facebookId,
            estado: 1,
            posicion: 1
        });
    } else {
        const entrada = await Ingreso.findOne({
            prospecto: usuario._id,
            entrada: new Date().toLocaleDateString()
        })
        if ( !entrada ) {
            const ingresoUsuario = new Ingreso({ prospecto: usuario._id, entrada: new Date().toLocaleDateString() });
            ingresoUsuario.save();
        }
    }
}
const envio = ( resultado, senderId, tipo = 'text' ) => {
    let peticion = {};
    switch ( tipo ) {
        default:
            peticion = {
                recipient: {
                    id: senderId
                },
                message: {
                    text: resultado
                }
            }
            break;
    }
    return peticion;
}
module.exports = { controllerDialogFlow }