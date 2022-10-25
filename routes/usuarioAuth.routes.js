const { Router } = require('express');
const { registrar, autenticar, confirmar } = require('../controllers/auth.controller');
const router = Router();

router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);

module.exports = router;