const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Crop must belong to a farmer'],
    },
    cropName: {
      type: String,
      required: [true, 'Please enter crop name'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Grains', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Spices', 'Other'],
      default: 'Other',
    },
    quantity: {
      type: Number,
      required: [true, 'Please enter quantity'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton'],
      default: 'quintal',
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please enter price per unit'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    location: {
      district: { type: String, trim: true },
      state: { type: String, trim: true },
    },
    harvestDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Crop', cropSchema);
