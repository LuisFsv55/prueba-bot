const Cliente = require("../models/Cliente");
const Sucursal = require("../models/Sucursal");
const Promocion = require("../models/Promocion");
const Producto = require("../models/Producto");
const Consulta = require("../models/Consulta");
const Valoracion = require("../models/Valoracion");
const Detalle = require("../models/Detalle");
const config = require("../config");
const fetch = require('node-fetch');

const controllerDialogFlow = async( resultado, senderId ) => {
    let peticion = {};
    let respuesta;
    ApiFacebook( senderId );
    switch (resultado.intent.displayName) {
        case 'Promocion': 
            respuesta = await Promociones( resultado.fulfillmentText );
            peticion = await envio( respuesta, senderId )
            break;
        case 'Sucursales': 
            respuesta = await Sucursales( resultado.fulfillmentText );
            peticion = await envio( respuesta, senderId )
            break;
        case 'Sillas':
            respuesta = await Sillas( resultado.fulfillmentText );
            peticion = await envio( respuesta, senderId )
            break;
        case 'Mesas':
            respuesta = await Mesas( resultado.fulfillmentText );
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
        default:
            peticion = await envio( resultado.fulfillmentText, senderId );
            break;
    }
    return peticion;
}
const valor = async( resultado, facebookId ) => {
    try {
        console.log(resultado.queryText);
        console.log(resultado.outputContexts);
        const comentario = resultado?.queryText;
        console.log("comentario" + comentario)
        const cliente = await Cliente.findOne({ facebookId });
        const registrar = new Valoracion( { opinion: comentario, cliente  } );
        registrar.save();
        console.log('------- Valoracion creada -------' + Cliente)
    } catch (error) {
        console.log('Error al insertar en la db: ' + error);
    }
    return resultado.fulfillmentText;
}
const Promociones = async( resultado ) => {
    const detalle = await Detalle.find().populate('producto').populate('promocion');
    // console.log(detalle)
    let strPromos = `Las promociones de este mes: \n`;
    detalle.forEach( (pro, index) => {
        strPromos = strPromos + `\n *⌛ ${ pro.promocion.nombre } de ${ pro.promocion.cantidadMesas } ${ pro.producto.nombre }s ${ pro.producto.forma } con ${ pro.promocion.cantidadSillas } Sillas a ${ pro.promocion.descuento }Bs`;
    });
    strPromos = strPromos + `\n ¿Quisiera un pedido de algun juego?`;
    return strPromos;
}
const formaMesaCuadrada = async( resultado, facebookId ) => {
    console.log('mesa cuadrada');
    const producto = await Producto.findOne({ forma: 'Cuadrada' });
    const cliente = await Cliente.findOne({ facebookId });
    console.log(cliente);
    console.log(producto);
    console.log("facebook id" + facebookId);
    if ( cliente && producto ) {
        console.log('entro aqui');
        await Consulta.create({ producto, cliente });
    }
    return resultado.fulfillmentText;
}
const formaMesaCircular = async( resultado, facebookId ) => {
    console.log('mesa cuadrada');
    const producto = await Producto.findOne({ forma: 'Redonda' });
    const cliente = await Cliente.findOne({ facebookId });
    if ( cliente && producto ) {
        console.log('entro aqui');
        await Consulta.create({ producto, cliente });
    }
    return resultado.fulfillmentText;
}
const PedidoSillas = async( resultado, facebookId ) => {
    const producto = await Producto.findOne({ nombre: 'Silla' });
    const cliente = await Cliente.findOne({ facebookId });
    if ( cliente && producto ) {
        await Consulta.create({ producto, cliente });
    }
    return resultado.fulfillmentText;
}
const PedirNombreCelular = async( resultado, facebookId ) => {
    try {
        // console.log(resultado);
        // console.log(resultado.parameters);
        // console.log(resultado.parameters.fields);
        console.log(resultado.outputContexts[0].parameters.fields);
        console.log(resultado.outputContexts[1].parameters.fields);
        const nombre = resultado?.outputContexts[1].parameters.fields.any.stringValue;
        // console.log("nombre"+ nombre)
        const celular = resultado?.outputContexts[1].parameters.fields.number.numberValue;
        // console.log("celular"+ celular)
        const cliente = await Cliente.findOne({ facebookId: `${facebookId}` })
        // console.log("cliente" + cliente)
        if ( cliente ) {
            await cliente.updateOne( { nombre, celular, facebookId } );
        } else {
            const registrar = new Cliente( { nombre, celular, facebookId  } );
            registrar.save();
        }
        console.log('------- Cliente creado -------' + Cliente)
    } catch (error) {
        console.log('Error al insertar en la db: ' + error);
    }
    return resultado.fulfillmentText;
}
const Precios = async( resultado, facebookId ) => {
    const obtenerTodosAlquileres = await Producto.find();
    let listar = 'Los precios de alquileres de sillas y mesas son los siguientes: ';
    obtenerTodosAlquileres.forEach( pro => {
        if ( pro.nombre === 'Silla' ) {
            listar = listar + `\n * 10 ${pro.nombre} a ${pro.precio}Bs`;
        } else {
            if ( pro.forma === 'Rectangular' ) {
                listar = listar + `\n * 5 ${pro.nombre}s de forma ${pro.forma} a ${pro.precio} Bs`;
            } else {
                listar = listar + `\n * 5 ${pro.nombre}s de forma ${pro.forma} a ${pro.precio} Bs`;
            }
        }
    });
    listar = listar + `\n ¿Quisiera realizar un pedido de mesas o sillas?`;
    return listar;
}
const Sillas = async() => {
    const obtenerSilla = await Producto.find();
    let listar = '';
    obtenerSilla.forEach( alquiler => {
        if ( alquiler.nombre === 'Silla' ) {
            listar = listar + `\n 🪑Las sillas están a un precio de: 10 sillas a ${alquiler.precio}Bs. \n¿Quisiera realizar un pedido?`;
        }
    });
    return listar;
}
const Mesas = async() => {
    const obtenerMesas = await Producto.find();
    let listar = 'El precio de las mesas son los siguientes: ';
    obtenerMesas.forEach( alquiler => {
        if ( alquiler.forma === 'Rectangular' || alquiler.forma === 'Circular' ) {
            listar = listar + `\n * 5 ${alquiler.nombre}s de forma ${alquiler.forma} a ${alquiler.precio}`;
        }
    });
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
const ApiFacebook = async( facebookId) => {
    const url = `https://graph.facebook.com/v15.0/${ facebookId }?fields=first_name,last_name,profile_pic&access_token=${ config.FB_PAGE_TOKEN }`;
    const resp = await fetch( url );
    const data = await resp.json();
    console.log(data);
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