const express = require('express');
const router = express.Router();
const {
  getMarketPrices,
  getPriceByCrop,
  addMarketPrice,
  getPriceTrends,
} = require('../controllers/priceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMarketPrices)
  .post(protect, authorize('admin'), addMarketPrice);

router.get('/trends/:cropName', getPriceTrends);
router.get('/:cropName', getPriceByCrop);

module.exports = router;
