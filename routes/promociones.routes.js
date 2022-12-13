const { Router } = require('express');
const { obtenerTodos, crearPromo, eliminarPromo, obtenerProducto, nofificar, notificacionUltima } = require('../controllers/promociones.controller');
const router = Router();

router.get( '/', obtenerTodos );
router.post( '/crear', crearPromo );
router.post( '/eliminar/:id', eliminarPromo );
router.get( '/productos', obtenerProducto );
router.get( '/notificacion/ultima', notificacionUltima );
router.get( '/notificaciones', nofificar );

module.exports = router;