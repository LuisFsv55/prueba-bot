const { Router } = require('express');
const { getTest } = require('../controllers/test.controller');
const router = Router();

router.get( '/', getTest );

module.exports = router;