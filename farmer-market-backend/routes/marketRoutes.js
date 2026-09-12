const express = require('express');
const router = express.Router();
const { getMarkets, getCommodities } = require('../controllers/marketController');

router.get('/markets', getMarkets);
router.get('/commodities', getCommodities);

module.exports = router;
