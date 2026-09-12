const mongoose = require('mongoose');

const cropAdvisorySchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
    },
    season: {
      type: String,
      enum: ['Kharif', 'Rabi', 'Zaid', 'Year-round'],
      default: 'Rabi',
    },
    stage: {
      type: String, // 'Sowing', 'Vegetative', 'Flowering', 'Harvesting'
      default: 'Vegetative',
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Disease', 'Pest Control', 'Fertilizer & Nutrition', 'Irrigation', 'Weather Alert'],
      default: 'Pest Control',
    },
    symptoms: [
      {
        type: String,
      },
    ],
    organicSolution: {
      type: String,
    },
    chemicalSolution: {
      type: String,
    },
    recommendedDosage: {
      type: String,
    },
    severity: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Critical'],
      default: 'Moderate',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CropAdvisory', cropAdvisorySchema);
