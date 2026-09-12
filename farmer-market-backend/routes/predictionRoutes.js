const express = require('express');
const router = express.Router();
const { get3DayPrediction, retrainModel } = require('../controllers/predictionController');

router.get('/3-day/:commodity/:market', get3DayPrediction);
router.post('/predict', async (req, res, next) => {
    // Also support POST /predict with body { commodity, market }
    req.params.commodity = req.body.commodity || 'Tomato';
    req.params.market = req.body.market || 'Rajkot Mandi';
    return get3DayPrediction(req, res, next);
});
router.post('/train', retrainModel);

module.exports = router;
