const express = require('express');
const router = express.Router();
const {
    createCrop,
    getCrops,
    getMyCrops,
    searchCrops,
    getCropById,
    updateCrop,
    deleteCrop
} = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getCrops)
    .post(protect, authorizeRoles('farmer'), createCrop);

router.get('/my', protect, authorizeRoles('farmer'), getMyCrops);
router.get('/search', searchCrops);

router.route('/:id')
    .get(getCropById)
    .put(protect, authorizeRoles('farmer', 'admin'), updateCrop)
    .delete(protect, authorizeRoles('farmer', 'admin'), deleteCrop);

module.exports = router;
