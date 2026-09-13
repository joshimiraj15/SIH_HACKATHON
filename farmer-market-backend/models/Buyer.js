const mongoose = require('mongoose');

const BuyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Buyer name is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    cropRequired: {
      type: String,
      required: [true, 'Crop required is required'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity in Quintals is required'],
      min: [1, 'Quantity must be at least 1 Quintal']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Offered price per quintal is required']
    },
    contact: {
      type: String,
      required: [true, 'Contact information is required'],
      trim: true
    },
    verified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Buyer', BuyerSchema);
