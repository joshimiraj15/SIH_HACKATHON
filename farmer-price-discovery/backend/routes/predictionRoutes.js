const express = require('express');
const router = express.Router();
const { get3DayPrediction, retrainModel } = require('../controllers/predictionController');

router.get('/3-day/:commodity/:market', get3DayPrediction);
router.post('/train', retrainModel);

module.exports = router;
