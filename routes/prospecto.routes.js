const { Router } = require('express');
const { getProspecto, postProspecto, getProspectoContactar, moverEstado, postOneMensaje } = require('../controllers/prospecto.controller');
const router = Router();

router.get('/', getProspecto);
router.post('/contactar', postProspecto);
router.post('/contactar/mensaje', postOneMensaje);
router.post('/estado', moverEstado);
router.get('/contactar', getProspectoContactar);

module.exports = router;