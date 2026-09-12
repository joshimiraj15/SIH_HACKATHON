const express = require('express');
const router = express.Router();
const {
  getMarketPrices,
  getPriceRadar,
  getWhereToSellRecommendations,
  getPriceForecast,
  addMarketPrice,
} = require('../controllers/priceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getMarketPrices);
router.get('/radar/:cropName', getPriceRadar);
router.post('/where-to-sell', getWhereToSellRecommendations);
router.get('/forecast/:cropName', getPriceForecast);
router.post('/', protect, authorize('admin'), addMarketPrice);

module.exports = router;
