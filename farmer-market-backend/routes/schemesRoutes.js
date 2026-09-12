const express = require('express');
const router = express.Router();
const { getSchemes, getMspRates } = require('../controllers/schemesController');

router.get('/', getSchemes);
router.get('/msp-rates', getMspRates);

module.exports = router;
