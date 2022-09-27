const Cliente = require("../models/Cliente");
const Sucursal = require("../models/Sucursal");
const Promocion = require("../models/Promocion");
const Producto = require("../models/Producto");
const Consulta = require("../models/Consulta");
const Valoracion = require("../models/Valoracion");

const controllerDialogFlow = async( resultado, senderId ) => {
    let peticion = {};
    let respuesta;
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
        const comentario = resultado?.outputContexts[0].parameters.fields.any.stringValue;
        const registrar = new Valoracion( { opinion: comentario, cliente: facebookId  } );
        registrar.save();
        console.log('------- Valoracion creada -------' + Cliente)
    } catch (error) {
        console.log('Error al insertar en la db: ' + error);
    }
    return resultado.fulfillmentText;
}
const Promociones = async( resultado ) => {
    const promoDb = await Promocion.find();
    let strPromos = 'Las promociones de este mes: \n';
    promoDb.forEach( (pro, index) => {
        strPromos = strPromos + `\n *⌛ ${ index }. ${pro.descripcion} a un precio de ${ pro.precio } Bs`;
    });
    strPromos = strPromos + `\n ¿Quisiera un pedido de algun juego`;
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
        const nombre = resultado?.outputContexts[0].parameters.fields.any.stringValue;
        const celular = resultado?.outputContexts[0].parameters.fields.number.numberValue;
        const cliente = await Cliente.findOne({ facebookId })
        if ( cliente ) {
            await cliente.updateOne( { nombre, celular } );
        } else {
            const registrar = new Cliente( { nombre, celular, facebookId  } );
            registrar.save();
        }
        console.log('------- Cliente creado -------' + Cliente)
    } catch (error) {
        console.log('Error al insertar en la db: ' + e);
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