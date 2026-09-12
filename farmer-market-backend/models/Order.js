const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: [true, 'Order must belong to a crop'],
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a buyer'],
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a farmer'],
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
    },
    quantity: {
      type: Number,
      required: [true, 'Order quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'NetBanking', 'Card', 'COD', 'Escrow'],
      default: 'COD',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'in_transit', 'delivered', 'cancelled'],
      default: 'placed',
    },
    shippingAddress: {
      street: { type: String, trim: true },
      village: { type: String, trim: true },
      district: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
