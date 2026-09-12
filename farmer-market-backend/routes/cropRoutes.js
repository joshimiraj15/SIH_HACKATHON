const express = require('express');
const router = express.Router();
const {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  getMyCrops,
} = require('../controllers/cropController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllCrops)
  .post(protect, authorize('farmer', 'admin'), createCrop);

router.get('/my/listings', protect, authorize('farmer', 'admin'), getMyCrops);

router.route('/:id')
  .get(getCropById)
  .put(protect, authorize('farmer', 'admin'), updateCrop)
  .delete(protect, authorize('farmer', 'admin'), deleteCrop);

module.exports = router;
