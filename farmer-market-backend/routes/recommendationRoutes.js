const express = require('express');
const router = express.Router();
const { getRecommendation } = require('../controllers/recommendationController');

router.get('/:commodity/:market', getRecommendation);
router.get('/', getRecommendation);

module.exports = router;
