const express = require('express');
const router = express.Router();
const {
  getUserAlerts,
  createAlert,
  toggleAlert,
  deleteAlert,
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserAlerts);
router.post('/', protect, createAlert);
router.patch('/:id/toggle', protect, toggleAlert);
router.delete('/:id', protect, deleteAlert);

module.exports = router;
