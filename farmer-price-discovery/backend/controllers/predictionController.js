const { getPredictionFromML, triggerModelRetrain } = require('../services/mlService');
const Prediction = require('../models/Prediction');

exports.get3DayPrediction = async (req, res, next) => {
    try {
        const { commodity, market } = req.params;

        const mlResult = await getPredictionFromML(commodity, market);

        if (!mlResult.success) {
            return res.status(400).json(mlResult);
        }

        const data = mlResult.data;

        for (const item of data.predictions) {
            await Prediction.create({
                commodity: data.commodity,
                market: data.market,
                predictionDate: new Date(item.date),
                predictedPrice: item.predicted_price,
                lowerBound: item.lower_bound,
                upperBound: item.upper_bound,
                modelName: data.model_name,
                trend: data.trend,
                reliability: data.reliability
            }).catch(err => console.error('Error logging prediction:', err.message));
        }

        res.status(200).json({
            success: true,
            message: `3-Day Price Prediction for ${commodity} in ${market}`,
            data
        });
    } catch (error) {
        next(error);
    }
};

exports.retrainModel = async (req, res, next) => {
    try {
        const result = await triggerModelRetrain();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
