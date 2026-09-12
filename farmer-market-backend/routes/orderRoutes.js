const express = require('express');
const router = express.Router();
const {
  createDirectOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/direct', protect, createDirectOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;
