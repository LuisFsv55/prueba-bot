const { default: mongoose } = require('mongoose');
const Contacto = require('../models/Contacto');
const Ingreso = require('../models/Ingreso');
const Prospecto = require('../models/Prospecto');

// =====_____*****_____***** Método POST :: Estado 1 *****_____*****_____*****=====
const getProspecto = async( req, res ) => {
    let prospectoInicial = [];
    let total = await Prospecto.find();
    let i = 0;
    while ( i < total.length ) {
        let inicial = total[i];
        if ( inicial.estado === 1 ) {
            let [entrada, numeroVeces, ultimoIngreso] = await Promise.all([
                Ingreso.find({ prospecto: inicial._id }),
                Ingreso.countDocuments({ prospecto: inicial._id }),
                Ingreso.find().sort( { $natural: -1 } ).limit( 1 ),
            ]) 
            let objProspecto = {
                prospecto: inicial,
                numeroVeces,
                ultimoIngreso
            };
            prospectoInicial.push( objProspecto );
        }
        i++;
    }
    res.json({ prospectoInicial });
}
// =====_____*****_____***** Método POST :: Estado 2 *****_____*****_____*****=====
const postProspecto = async(req, res) => {
    const { id } = req.params;
    const { contactar, medio, mensaje, usuarioId } = req.body;
    
    try {
        const prospecto = await Prospecto.findOne({ _id: id });
        prospecto.estado = 2;
        prospecto.save();
        const fecha = new Date().toLocaleDateString();
        const hora = new Date().toLocaleTimeString();
        const usuario = mongoose.Types.ObjectId( usuarioId );
        const idPros = new mongoose.Types.ObjectId( id );
        // Nuevo contacto
        const cont = new Contacto({ contactar, medio, mensaje, fecha, hora, idPros, usuario });
        cont.save();
        res.json({
            cont
        });
    } catch (error) {
        return res.status( 400 ).json({ msg: error.message });
    }

};
const getProspectoContactar = async( req, res ) => {
    let prospectoInicial = [];
    let total = await Prospecto.find();
    let i = 0;
    while ( i < total.length ) {
        let inicial = total[i];
        if ( inicial.estado === 2 ) {
            let [ numeroVeces, fechaUltima ] = await Promise.all([
                Contacto.countDocuments({ idPros: inicial._id }),
                Contacto.find({ idPros: inicial._id }).sort( { $natural: -1 } ).limit( 1 ),
            ]) 
            let objProspecto = {
                numeroVeces,
                fechaUltima
            };
            prospectoInicial.push( objProspecto );
        }
        i++;
    }
    res.json({ prospectoInicial });
};
module.exports = { getProspecto, postProspecto, getProspectoContactar };