const mongoose = require('mongoose');

const MarketPriceSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true, default: Date.now },
        commodity: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        district: { type: String, required: true, trim: true },
        market: { type: String, required: true, trim: true },
        variety: { type: String, default: 'Local' },
        grade: { type: String, default: 'A' },
        minPrice: { type: Number, required: true },
        maxPrice: { type: Number, required: true },
        modalPrice: { type: Number, required: true },
        arrivalQuantity: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);
