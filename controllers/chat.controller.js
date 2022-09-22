require('dotenv').config();
const request = require('request');
const { controllerDialogFlow } = require('../helpers/controllerDialogFlow');
const { detectIntent } = require('../helpers/intentDetectado');
const config = require('../config/index');
const Alquiler = require('../models/Alquiler');
const Sucursal = require('../models/Sucursal');

const test = ( req, res ) => {
    // const sucursal = new Sucursal( { departamento: 'Santa Cruz', municipio: 'El Torno', barrio: '6 de Mayo', calle: 'Bolivia', numero: '80' } );
    // const sucursal1 = new Sucursal( { departamento: 'Santa Cruz', municipio: 'El Torno', barrio: 'Miraflores', calle: 'Naciones Unidas', numero: '10' } );
    // const alquiler1 = new Alquiler( { nombre: 'Mesa', precio: '100', forma: 'Circular' } );
    // const alquiler2 = new Alquiler( { nombre: 'Mesa', precio: '70', forma: 'Rectangular' } );
    // const alquiler3 = new Alquiler( { nombre: 'Silla', precio: '50' } );
    // sucursal.save();
    // sucursal1.save();
    // alquiler1.save();
    // alquiler2.save();
    // alquiler3.save();
    res.send('Bot prueba');
    console.log('Bot prueba');
}
const getWebHook = ( req, res ) => {
    const verifyToken = config.MY_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challengue = req.query['hub.challenge'];
    if ( mode && token ) {
        if ( mode === 'subscribe' && token === verifyToken ) {
            console.log(' webhook verificado ');
            res.status( 200 ).send( challengue );
        } else {
            res.sendStatus( 403 );
        }
    }
}
const postWebHook = ( req, res ) => {
    let data = req.body;
    if ( data.object === "page" ) {
        data.entry.forEach( pageEntry => {
            pageEntry.messaging.forEach( messagingEvent => {
                if (messagingEvent.message) {
                    receivedMessage( messagingEvent );
                } else {
                    console.log( "Webhook received unknown messagingEvent: ", messagingEvent );
                }
            });
        });
        res.sendStatus(200);
    } else {
        res.sendStatus( 404 );
    } 

}
const receivedMessage = async( event ) => {
    let senderId = event.sender.id;
    let message = event.message;
    let messageText = message.text;
    if ( messageText ) {
        console.log("1.MENSAJE DEL USUARIO: ", messageText);
        await sendDialogFlow(senderId, messageText);
    }
}
const sendDialogFlow = async( senderId, messageText ) => {
    let respuesta = await detectIntent( config.GOOGLE_PROJECT_ID, senderId, messageText, '', 'es' );
    // console.log(respuesta)
    let peticion_body = {};
    peticion_body = await controllerDialogFlow( respuesta, senderId );
    envioMensaje( peticion_body );
}
const envioMensaje = async( peticion_body ) => {
    console.log('Envio mensaje a messenger');
    request(
        {
            uri: "https://graph.facebook.com/v14.0/me/messages",
            qs: { "access_token": config.FB_PAGE_TOKEN },
            method: "POST",
            json: peticion_body
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
            } else {
                console.error("Unable to send message:" + err);
            }
        }
    );
}
const sendTypingOff = recipientId => {
    var messageData = {
      recipient: {
        id: recipientId,
      },
      sender_action: "typing_off",
    };
    // TODO:
    // callSendAPI(messageData);
}
module.exports ={ test, getWebHook, postWebHook };