const mongoose = require('mongoose');

const MarketPriceSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true, default: Date.now },
        commodity: { type: String, trim: true },
        cropName: { type: String, trim: true },
        state: { type: String, required: true, trim: true },
        district: { type: String, required: true, trim: true },
        market: { type: String, trim: true },
        marketName: { type: String, trim: true },
        variety: { type: String, default: 'Local' },
        grade: { type: String, default: 'A' },
        minPrice: { type: Number, required: true },
        maxPrice: { type: Number, required: true },
        modalPrice: { type: Number, required: true },
        arrivalQuantity: { type: Number, default: 0 },
        unit: { type: String, default: 'Quintal' }
    },
    { timestamps: true }
);

// Pre-save hook to ensure commodity/cropName and market/marketName sync
MarketPriceSchema.pre('save', function (next) {
    if (!this.commodity && this.cropName) this.commodity = this.cropName;
    if (!this.cropName && this.commodity) this.cropName = this.commodity;
    if (!this.market && this.marketName) this.market = this.marketName;
    if (!this.marketName && this.market) this.marketName = this.market;
    next();
});

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);
