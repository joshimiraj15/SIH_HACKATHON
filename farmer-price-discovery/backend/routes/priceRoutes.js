const express = require('express');
const router = express.Router();
const { getPrices, getPriceHistory, getPriceComparison } = require('../controllers/priceController');

router.get('/', getPrices);
router.get('/history', getPriceHistory);
router.get('/comparison', getPriceComparison);

module.exports = router;
