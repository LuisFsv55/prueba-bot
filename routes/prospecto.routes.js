const { Router } = require('express');
const { getProspecto, postProspecto, getProspectoContactar, moverEstado } = require('../controllers/prospecto.controller');
const router = Router();

router.get('/', getProspecto);
router.post('/contactar/:id', postProspecto);
router.post('/estado', moverEstado);
router.get('/contactar', getProspectoContactar);

module.exports = router;