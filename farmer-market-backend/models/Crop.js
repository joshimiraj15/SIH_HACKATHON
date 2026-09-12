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
    variety: {
      type: String,
      trim: true,
      default: 'Standard',
    },
    category: {
      type: String,
      enum: ['Grains', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Spices', 'Other'],
      default: 'Grains',
    },
    quantity: {
      type: Number,
      required: [true, 'Please enter quantity'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'crate'],
      default: 'quintal',
    },
    minOrderQuantity: {
      type: Number,
      default: 5,
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please enter price per unit'],
      min: [0, 'Price cannot be negative'],
    },
    qualityGrade: {
      type: String,
      enum: ['Grade A', 'Grade B', 'Grade C'],
      default: 'Grade A',
    },
    moistureContent: {
      type: Number,
      default: 11.5,
    },
    isOrganic: {
      type: Boolean,
      default: false,
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
      village: { type: String, trim: true, default: '' },
      district: { type: String, trim: true, default: 'Rajkot' },
      state: { type: String, trim: true, default: 'Gujarat' },
      coordinates: {
        lat: { type: Number, default: 22.3039 },
        lng: { type: Number, default: 70.8022 },
      },
    },
    harvestDate: {
      type: Date,
      default: Date.now,
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

cropSchema.index({ cropName: 1, category: 1, 'location.state': 1, 'location.district': 1, status: 1 });

module.exports = mongoose.model('Crop', cropSchema);
