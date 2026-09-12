const express = require('express');
const router = express.Router();
const { getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
