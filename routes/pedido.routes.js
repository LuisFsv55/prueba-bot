const { Router } = require('express');
const { getPedido } = require('../controllers/pedido.controller');
const router = Router();

router.get( '/', getPedido );

module.exports = router;