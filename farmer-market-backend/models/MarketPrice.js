const mongoose = require('mongoose');

const MarketPriceSchema = new mongoose.Schema(
    {
        cropName: {
            type: String,
            required: [true, 'Crop name is required'],
            trim: true,
            lowercase: true
        },
        marketName: {
            type: String,
            required: [true, 'Market name is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        district: {
            type: String,
            required: [true, 'District is required'],
            trim: true
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now
        },
        minPrice: {
            type: Number,
            required: [true, 'Minimum price is required'],
            min: [0, 'Min price must be positive']
        },
        maxPrice: {
            type: Number,
            required: [true, 'Maximum price is required'],
            min: [0, 'Max price must be positive']
        },
        modalPrice: {
            type: Number,
            required: [true, 'Modal price is required'],
            min: [0, 'Modal price must be positive']
        },
        unit: {
            type: String,
            required: [true, 'Unit is required'],
            default: 'Quintal'
        }
    },
    {
        timestamps: true
    }
);

MarketPriceSchema.pre('save', function (next) {
    if (this.minPrice > this.modalPrice || this.modalPrice > this.maxPrice) {
        return next(new Error('Validation Error: Prices must satisfy minPrice <= modalPrice <= maxPrice'));
    }
    next();
});

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);
