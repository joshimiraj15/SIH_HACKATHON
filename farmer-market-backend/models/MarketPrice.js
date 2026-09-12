const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    variety: {
      type: String,
      trim: true,
      default: 'Common',
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    market: {
      type: String,
      required: [true, 'Market / Mandi name is required'],
      trim: true,
    },
    minPrice: {
      type: Number,
      required: [true, 'Minimum price is required'],
    },
    maxPrice: {
      type: Number,
      required: [true, 'Maximum price is required'],
    },
    modalPrice: {
      type: Number,
      required: [true, 'Modal / Average price is required'],
    },
    priceChange: {
      type: Number,
      default: 0,
    },
    priceChangePercent: {
      type: Number,
      default: 0,
    },
    trend: {
      type: String,
      enum: ['rising', 'falling', 'stable'],
      default: 'stable',
    },
    arrivalQuantity: {
      type: Number, // In Quintals/Tonnes
      default: 150,
    },
    arrivalUnit: {
      type: String,
      default: 'Tonnes',
    },
    coordinates: {
      lat: { type: Number, default: 22.3039 },
      lng: { type: Number, default: 70.8022 },
    },
    priceDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

marketPriceSchema.index({ cropName: 1, state: 1, district: 1, market: 1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
