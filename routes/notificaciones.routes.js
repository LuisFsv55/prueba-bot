const { Router } = require('express');
const { unreadNotifications } = require('../controllers/notificaciones.controller');
const router = Router();

//router.get( '/', getPedido );
router.get( '/unread-notification', unreadNotifications );
//router.get( '/cliente/:id', getOneCliente );

module.exports = router;