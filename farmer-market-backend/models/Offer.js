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
    counterPrice: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'countered'],
      default: 'pending',
    },
    deliveryTerms: {
      type: String,
      default: 'Buyer Pickup',
    },
    paymentTerms: {
      type: String,
      default: 'Escrow / On Delivery',
    },
    message: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
    },
  },
  {
    timestamps: true,
  }
);

offerSchema.pre('save', function (next) {
  if (this.offeredPrice && this.quantity) {
    this.totalAmount = this.offeredPrice * this.quantity;
  }
  next();
});

module.exports = mongoose.model('Offer', offerSchema);
