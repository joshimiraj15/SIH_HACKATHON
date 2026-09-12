const express = require('express');
const router = express.Router();
const {
  getAllCrops,
  getCropById,
  getMyCrops,
  createCrop,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllCrops);
router.get('/my/listings', protect, getMyCrops);
router.get('/:id', getCropById);
router.post('/', protect, authorize('farmer', 'admin'), createCrop);
router.put('/:id', protect, updateCrop);
router.delete('/:id', protect, deleteCrop);

module.exports = router;
