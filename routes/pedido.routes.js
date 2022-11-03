const { Router } = require('express');
const { getPedido, getOneCliente, getMuchoPedido } = require('../controllers/pedido.controller');
const router = Router();

router.get( '/', getPedido );
router.get( '/maspedido', getMuchoPedido );
router.get( '/cliente/:id', getOneCliente );

module.exports = router;