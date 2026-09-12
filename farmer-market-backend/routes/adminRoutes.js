const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getFarmers,
    getBuyers,
    getAllCrops,
    getAllOffers,
    getAllOrders,
    getDashboardStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect, authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.get('/farmers', getFarmers);
router.get('/buyers', getBuyers);
router.get('/crops', getAllCrops);
router.get('/offers', getAllOffers);
router.get('/orders', getAllOrders);
router.get('/stats', getDashboardStats);

module.exports = router;
