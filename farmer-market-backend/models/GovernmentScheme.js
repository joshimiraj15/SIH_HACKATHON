const mongoose = require('mongoose');

const governmentSchemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['MSP', 'Financial Support', 'Crop Insurance', 'Irrigation & Solar', 'Subsidies', 'Credit & Loans'],
      default: 'Financial Support',
    },
    ministry: {
      type: String,
      default: 'Ministry of Agriculture & Farmers Welfare',
    },
    benefitAmount: {
      type: String, // e.g. "₹6,000 / year", "Up to 80% Subsidy"
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    eligibility: [
      {
        type: String,
      },
    ],
    documentsRequired: [
      {
        type: String,
      },
    ],
    portalUrl: {
      type: String,
      default: 'https://pmkisan.gov.in',
    },
    mspCropDetails: {
      cropName: { type: String },
      season: { type: String, enum: ['Kharif', 'Rabi', 'Other'] },
      msp2023_24: { type: Number },
      msp2024_25: { type: Number },
      msp2025_26: { type: Number },
      marketPriceAvg: { type: Number },
      unit: { type: String, default: '₹/quintal' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GovernmentScheme', governmentSchemeSchema);
