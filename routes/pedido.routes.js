const { Router } = require('express');
const { getPedido, getOneCliente } = require('../controllers/pedido.controller');
const router = Router();

router.get( '/', getPedido );
router.get( '/cliente/:id', getOneCliente );

module.exports = router;