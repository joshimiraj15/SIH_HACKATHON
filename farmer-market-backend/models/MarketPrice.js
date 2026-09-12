const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
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
    priceDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for quick market lookups
marketPriceSchema.index({ cropName: 1, state: 1, district: 1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
