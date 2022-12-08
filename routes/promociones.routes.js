const { Router } = require('express');
const { obtenerTodos, crearPromo, eliminarPromo } = require('../controllers/promociones.controller');
const router = Router();

router.get( '/', obtenerTodos );
router.post( '/crear', crearPromo );
router.post( '/eliminar/:id', eliminarPromo );

module.exports = router;