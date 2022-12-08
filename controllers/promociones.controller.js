const Detalle = require("../models/Detalle");
const Promocion = require("../models/Promocion");


const obtenerTodos = async( req, res ) => {
    const detalle = await Detalle.find().populate('producto').populate('promocion');
    res.json({
        detalle
    });
}
const crearPromo = async( req, res ) => {
    const { nombre, descuento, descripcion, cantidadSillas, cantidadMesas, producto } = req.body;
    const fecha = new Date().toLocaleDateString('es-ES', {
        timeZone: 'America/La_Paz',
    });
    const nuevaPromocion = new Promocion({
        nombre, 
        descuento,
        descripcion,
        fecha,
        cantidadSillas,
        cantidadMesas
    });
    await nuevaPromocion.save();
    const detallePromocion = new Detalle({
        producto,
        promocion: nuevaPromocion._id
    });
    await detallePromocion.save();
    res.json({
        msg: 'creado exitosamente'
    })
}
const eliminarPromo = ( req, res ) => {

}
module.exports = {
    obtenerTodos, crearPromo, eliminarPromo
}