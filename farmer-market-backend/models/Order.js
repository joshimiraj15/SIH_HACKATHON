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
    unit: {
      type: String,
      default: 'quintal',
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled'],
      default: 'placed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'in_escrow', 'released_to_farmer', 'completed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'NetBanking', 'Card', 'COD', 'Escrow'],
      default: 'Escrow',
    },
    trackingNumber: {
      type: String,
      default: () => 'KS-' + Math.floor(100000 + Math.random() * 900000),
    },
    estimatedDeliveryDate: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    shippingAddress: {
      street: { type: String, trim: true, default: 'Warehouse Hub 4' },
      district: { type: String, trim: true, default: 'Rajkot' },
      state: { type: String, trim: true, default: 'Gujarat' },
      pincode: { type: String, trim: true, default: '360001' },
    },
    timeline: [
      {
        status: { type: String },
        note: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('save', function (next) {
  if (this.isModified('orderStatus') && this.orderStatus) {
    if (!this.timeline) this.timeline = [];
    this.timeline.push({
      status: this.orderStatus,
      note: `Order status updated to ${this.orderStatus}`,
      timestamp: new Date(),
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
