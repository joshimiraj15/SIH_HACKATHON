const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema(
    {
        cropId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Crop',
            required: true
        },
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        offeredPrice: {
            type: Number,
            required: [true, 'Offered price is required'],
            min: [0.01, 'Offered price must be greater than 0']
        },
        quantity: {
            type: Number,
            required: [true, 'Offered quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        message: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Offer', OfferSchema);
