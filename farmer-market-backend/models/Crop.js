const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Crop', CropSchema);
