const express = require('express');
const router = express.Router();
const { getAdvisories, createAdvisory } = require('../controllers/advisoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAdvisories);
router.post('/', protect, authorize('admin'), createAdvisory);

module.exports = router;
