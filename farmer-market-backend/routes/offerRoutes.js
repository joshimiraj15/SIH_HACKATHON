const express = require('express');
const router = express.Router();
const {
  createOffer,
  getUserOffers,
  updateOfferStatus,
} = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOffer);
router.get('/my-offers', protect, getUserOffers);
router.patch('/:id/status', protect, updateOfferStatus);

module.exports = router;
