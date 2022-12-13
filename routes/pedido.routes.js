const { Router } = require('express');
const { getPedido, getOneCliente, getMuchoPedido, obtener4estado, oneNotificacion } = require('../controllers/pedido.controller');
const router = Router();

router.get( '/', getPedido );
router.get( '/clientes', obtener4estado );
router.get( '/maspedido', getMuchoPedido );
router.get( '/cliente/:id', getOneCliente );
router.get( '/notificaciones/:id', oneNotificacion );

module.exports = router;