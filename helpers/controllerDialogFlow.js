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
    console.log('------------------Inicio-------------');
    console.log(resultado);
    console.log(resultado.queryText);
    console.log('------------------Fin-------------');
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
    const producto = await Producto.findOne({ forma: 'Cuadrada' });
    const prospecto = await Prospecto.findOne({ facebookId });
    if ( prospecto && producto ) {
        console.log('entro aqui');
        await Consulta.create({ producto, prospecto });
    }
    return resultado.fulfillmentText;
}
const formaMesaCircular = async( resultado, facebookId ) => {
    console.log('mesa cuadrada');
    const producto = await Producto.findOne({ forma: 'Redonda' });
    const prospecto = await Prospecto.findOne({ facebookId });
    if ( prospecto && producto ) {
        console.log('entro aqui');
        await Consulta.create({ producto, prospecto });
    }
    return resultado.fulfillmentText;
}
const PedidoSillas = async( resultado, facebookId ) => {
    const producto = await Producto.findOne({ nombre: 'Silla' });
    const prospecto = await Prospecto.findOne({ facebookId });
    if ( prospecto && producto ) {
        await Consulta.create({ producto, prospecto });
    }
    return resultado.fulfillmentText;
}
const PedirNombreCelular = async( resultado, facebookId ) => {
    try {
        console.log(resultado.outputContexts[0].parameters.fields);
        console.log(resultado.outputContexts[1].parameters.fields);
        const nombre = resultado?.outputContexts[1].parameters.fields.any.stringValue;
        const celular = resultado?.outputContexts[1].parameters.fields.number.numberValue;
        const cliente = await Cliente.findOne({ facebookId: `${facebookId}` });
        const usuario = await Prospecto.findOne({ facebookId });
        if ( cliente ) {
            await cliente.updateOne( { nombre, celular } );
        } else {
            const registrar = new Cliente( { nombre, celular, facebookId, idPros: usuario._id  } );
            registrar.save();
        }
        console.log('------- Cliente creado -------' + Cliente)
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
        if ( pro.nombre === 'Silla' ) {
            listar = listar + `\n * 10 ${pro.nombre} a ${pro.precio}Bs`;
        } else {
            if ( pro.forma === 'Cuadrada' ) {
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
    const producto = await Producto.findOne({ nombre: 'Silla' });
    const prospecto = await Prospecto.findOne({ facebookId });
    let listar = '';
    let imagenSilla = [];
    obtenerSilla.forEach( alquiler => {
        if ( alquiler.nombre === 'Silla' ) {
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
const Mesas = async(resultado, facebookId) => {
    const producto = await Producto.findOne({ forma: 'Cuadrada' });
    const producto1 = await Producto.findOne({ forma: 'Redonda' });
    const prospecto = await Prospecto.findOne({ facebookId });
    const obtenerMesas = await Producto.find();
    let listar = 'El precio de las mesas son los siguientes: ';
    obtenerMesas.forEach( alquiler => {
        if ( alquiler.forma === 'Cuadrada' || alquiler.forma === 'Redonda' ) {
            listar = listar + `\n * 5 ${alquiler.nombre}s de forma ${alquiler.forma} a ${alquiler.precio}Bs`;
        }
    });
    if ( prospecto && producto ) {
        await Consulta.create({ producto, prospecto });
        await Consulta.create({ producto1, prospecto });
    }
    listar = listar + '\n ¿Quisiera realizar un pedido?';
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
    const producto = await parseInt( resultado.outputContexts[2].parameters.fields.Formas.stringValue );
    const mesa = await Producto.findOne({ forma: producto });
    let silla, carrito;
    let cliente = await Cliente.findOne({ idPros: facebookId });
    let prospecto = await Prospecto.findOne({ facebookId });
    if ( !mesa ) {// es mesa
        silla = await Producto.findOne({ nombre: "silla" });        
    }
    // 2. Verificar si es cliente por 1ra vez y crearlo un cliente
    if ( !cliente ) {
        cliente = await Cliente.create({
            nombre: prospecto.nombre,
            facebookId: prospecto.facebookId,
            idPros: prospecto.facebookId
        });
    }
    // 3. Encontramos cliente y prospecto: encontrar pedido anterior
    if ( cliente ) {
        // encontramos el anterior carrito
        carrito = await Pedido.findOne({ cliente: cliente._id });
    }
    // crear nuevo
    if ( !carrito ) {
        const fecha = new Date().toLocaleDateString();
        const hora = new Date().toLocaleTimeString();
        carrito = await Pedido.create({
            monto: 0,
            fecha, hora,
            cliente: cliente._id
            // confirmado por defecto
        });
    }
    // detalle del pedido
    let subtTotal = cantidad * parseInt( producto.precio );
    await PedidoDetalle.create({
        cantidad,
        precio: parseInt( producto.precio ),
        sub_total: subtTotal,
        producto: producto._id,
        pedido: carrito._id
    });
    // TODO: ACTUALIZAR MONTO
    
    
    
    
    // console.log('---------------Inicio carrito --------------');
    // console.log(resultado.outputContexts[2].parameters.fields.number.numberValue);
    // console.log(resultado.outputContexts[2].parameters.fields.Formas.stringValue);
    // console.log('---------------Fin carrito --------------');
    return resultado.fulfillmentText;
};
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