const mongoose = require('mongoose');

const MarketSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        state: { type: String, required: true },
        district: { type: String, required: true },
        location: { type: String },
        commodities: [{ type: String }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Market', MarketSchema);
