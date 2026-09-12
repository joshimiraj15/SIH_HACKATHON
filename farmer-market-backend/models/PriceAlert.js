const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    market: {
      type: String,
      trim: true,
      default: 'All Mandis',
    },
    condition: {
      type: String,
      enum: ['above', 'below'],
      default: 'above',
    },
    targetPrice: {
      type: Number,
      required: [true, 'Target price is required'],
    },
    currentPrice: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isTriggered: {
      type: Boolean,
      default: false,
    },
    lastTriggeredAt: {
      type: Date,
    },
    notificationType: {
      type: String,
      enum: ['in_app', 'sms', 'both'],
      default: 'both',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
