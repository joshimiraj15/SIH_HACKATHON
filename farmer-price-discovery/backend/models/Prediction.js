const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema(
    {
        commodity: { type: String, required: true },
        market: { type: String, required: true },
        predictionDate: { type: Date, required: true },
        predictedPrice: { type: Number, required: true },
        lowerBound: { type: Number },
        upperBound: { type: Number },
        modelName: { type: String, default: 'XGBoost' },
        trend: { type: String, enum: ['Increasing', 'Decreasing', 'Stable'] },
        reliability: { type: String, default: 'High' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Prediction', PredictionSchema);
