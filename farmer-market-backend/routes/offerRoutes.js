const express = require('express');
const router = express.Router();
const {
  createOffer,
  getOffersForCrop,
  getUserOffers,
  updateOfferStatus,
} = require('../controllers/offerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('buyer', 'admin'), createOffer);
router.get('/my-offers', protect, getUserOffers);
router.get('/crop/:cropId', protect, getOffersForCrop);
router.patch('/:id/status', protect, updateOfferStatus);

module.exports = router;
