const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
    status: { type: String, enum: ['processing', 'completed', 'cancelled'], default: 'processing' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
