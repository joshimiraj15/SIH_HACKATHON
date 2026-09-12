const express = require('express');
const router = express.Router();
const {
    createOffer,
    getFarmerOffers,
    getBuyerOffers,
    acceptOffer,
    rejectOffer
} = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .post(protect, authorizeRoles('buyer'), createOffer);

router.get('/farmer', protect, authorizeRoles('farmer'), getFarmerOffers);
router.get('/buyer', protect, authorizeRoles('buyer'), getBuyerOffers);
router.put('/:id/accept', protect, authorizeRoles('farmer'), acceptOffer);
router.put('/:id/reject', protect, authorizeRoles('farmer'), rejectOffer);

module.exports = router;
