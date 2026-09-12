const { getPredictionFromML } = require('../services/mlService');

exports.getRecommendation = async (req, res, next) => {
    try {
        const { commodity, market } = req.params;
        const mlResult = await getPredictionFromML(commodity, market);

        if (!mlResult.success) {
            return res.status(400).json(mlResult);
        }

        const { current_price, trend, recommended_day, recommendation, reliability } = mlResult.data;

        res.status(200).json({
            success: true,
            commodity,
            market,
            current_price,
            trend,
            recommended_day,
            recommendation,
            reliability,
            disclaimer: "This recommendation is generated using machine learning estimates based on historical trends. It does not guarantee financial or market outcomes."
        });
    } catch (error) {
        next(error);
    }
};
