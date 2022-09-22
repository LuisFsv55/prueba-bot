const Cliente = require("../models/Cliente");
const Alquiler = require("../models/Alquiler");
const Sucursal = require("../models/Sucursal");

const controllerDialogFlow = async( resultado, senderId ) => {
    let peticion = {};
    let respuesta;
    // console.log('---------------controller--------------');
    // console.log(resultado)
    // console.log('---------------fin controller--------------');
    // if (resultado.intent.displayName === 'Saludo') {
    //     console.log('si entre al if de saludo');
    // }
    switch (resultado.intent.displayName) {
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
            respuesta = await Precios( resultado.fulfillmentText );
            peticion = await envio( respuesta, senderId )
            break;
        case 'pedirTelefono':
            // console.log('-------Entro a pedirTelefono ----')
            // console.log(resultado?.outputContexts[0].parameters.fields.any.stringValue)
            // console.log(resultado?.outputContexts[0].parameters.fields.number.numberValue)
            respuesta = await PedirNombreCelular( resultado );
            peticion = await envio( respuesta, senderId );
            // console.log('-------Sale de pedirTelefono ----')
            break;
        default:
            peticion = await envio( resultado.fulfillmentText, senderId );
            break;
    }
    return peticion;
}
const PedirNombreCelular = async( resultado ) => {
    try {
        const nombre = resultado?.outputContexts[0].parameters.fields.any.stringValue;
        const celular = resultado?.outputContexts[0].parameters.fields.number.numberValue;
        const registrar = new Cliente( { nombre, celular } );
        registrar.save();
        console.log('------- Cleinte creado -------' + Cliente)
    } catch (error) {
        console.log('Error al insertar en la db: ' + e);
    }
    return resultado.fulfillmentText;
}
const Precios = async() => {
    const obtenerTodosAlquileres = await Alquiler.find();
    let listar = 'Los precios de alquileres de sillas y mesas son los siguientes: ';
    obtenerTodosAlquileres.forEach( alquiler => {
        if ( alquiler.nombre === 'Silla' ) {
            listar = listar + `\n * 10 ${alquiler.nombre} a ${alquiler.precio}Bs`;
        } else {
            if ( alquiler.forma === 'Rectangular' ) {
                listar = listar + `\n * 5 ${alquiler.nombre}s de forma ${alquiler.forma} a ${alquiler.precio} Bs`;
            } else {
                listar = listar + `\n * 5 ${alquiler.nombre}s de forma ${alquiler.forma} a ${alquiler.precio} Bs`;
            }
        }
    });
    listar = listar + `\n ¿Quisiera realizar un pedido de mesas o sillas?`;
    return listar;
}
const Sillas = async() => {
    const obtenerSilla = await Alquiler.find();
    let listar = '';
    obtenerSilla.forEach( alquiler => {
        if ( alquiler.nombre === 'Silla' ) {
            listar = listar + `\n 🪑Las sillas están a un precio de: 10 sillas a ${alquiler.precio}Bs. \n¿Quisiera realizar un pedido?`;
        }
    });
    return listar;
}
const Mesas = async() => {
    const obtenerMesas = await Alquiler.find();
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