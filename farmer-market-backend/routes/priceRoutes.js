const express = require('express');
const router = express.Router();
const {
    addMarketPrice,
    getAllMarketPrices,
    getPricesByCrop,
    getLatestPriceByCrop,
    searchPrices,
    discoverPrice,
    getPriceHistory,
    getPriceComparison,
    deleteMarketPrice,
    getLiveMandiPrices
} = require('../controllers/priceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getAllMarketPrices)
    .post(protect, authorizeRoles('admin'), addMarketPrice);

router.get('/live-mandi', getLiveMandiPrices);
router.get('/comparison', getPriceComparison);

router.get('/history', getPriceHistory);
router.get('/search', searchPrices);
router.get('/discover/:cropName', discoverPrice);
router.get('/latest/:cropName', getLatestPriceByCrop);
router.get('/crop/:cropName', getPricesByCrop);
router.delete('/:id', protect, authorizeRoles('admin'), deleteMarketPrice);

module.exports = router;
