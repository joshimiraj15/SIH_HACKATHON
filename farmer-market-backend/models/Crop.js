const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema(
    {
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        cropName: {
            type: String,
            required: [true, 'Crop name is required'],
            trim: true
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be negative']
        },
        unit: {
            type: String,
            required: [true, 'Unit is required'],
            default: 'Quintal'
        },
        expectedPrice: {
            type: Number,
            required: [true, 'Expected price is required'],
            min: [0, 'Expected price must be positive']
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true
        },
        harvestDate: {
            type: Date
        },
        description: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ['available', 'sold', 'inactive'],
            default: 'available'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Crop', CropSchema);
