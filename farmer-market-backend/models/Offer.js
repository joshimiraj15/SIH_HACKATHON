const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: [true, 'Offer must be linked to a crop'],
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Offer must be linked to a buyer'],
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Offer must be linked to a farmer'],
    },
    offeredPrice: {
      type: Number,
      required: [true, 'Please provide an offer price per unit'],
      min: [0, 'Offer price must be positive'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide desired quantity'],
      min: [1, 'Quantity must be at least 1'],
    },
    totalAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'countered'],
      default: 'pending',
    },
    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totalAmount before saving if not explicitly set
offerSchema.pre('save', function (next) {
  if (this.offeredPrice && this.quantity) {
    this.totalAmount = this.offeredPrice * this.quantity;
  }
  next();
});

module.exports = mongoose.model('Offer', offerSchema);
