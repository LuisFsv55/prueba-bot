const { Router } = require('express');
const { getProspecto, postProspecto, getProspectoContactar } = require('../controllers/prospecto.controller');
const router = Router();

router.get('/', getProspecto);
router.post('/contactar/:id', postProspecto);
router.get('/contactar', getProspectoContactar);

module.exports = router;