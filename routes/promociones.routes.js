const { Router } = require('express');
const { obtenerTodos, crearPromo, eliminarPromo, obtenerProducto } = require('../controllers/promociones.controller');
const router = Router();

router.get( '/', obtenerTodos );
router.post( '/crear', crearPromo );
router.post( '/eliminar/:id', eliminarPromo );
router.get( '/productos', obtenerProducto );

module.exports = router;