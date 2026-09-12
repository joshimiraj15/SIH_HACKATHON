const Offer = require('../models/Offer');
const Crop = require('../models/Crop');
const Order = require('../models/Order');

// @desc    Create a new offer on a crop
// @route   POST /api/offers
// @access  Private (Buyer)
exports.createOffer = async (req, res) => {
  try {
    const { cropId, offeredPrice, quantity, message } = req.body;

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    if (crop.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Crop is currently ${crop.status} and cannot receive new offers`,
      });
    }

    if (crop.farmer.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot make an offer on your own crop listing',
      });
    }

    const offer = await Offer.create({
      crop: cropId,
      buyer: req.user._id,
      farmer: crop.farmer,
      offeredPrice,
      quantity,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Offer submitted successfully',
      data: offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get offers for a specific crop (Farmer only)
// @route   GET /api/offers/crop/:cropId
// @access  Private (Farmer owner or Admin)
exports.getOffersForCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.cropId);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    if (crop.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view offers for this listing',
      });
    }

    const offers = await Offer.find({ crop: req.params.cropId })
      .populate('buyer', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all offers relevant to logged in user (as buyer or farmer)
// @route   GET /api/offers/my-offers
// @access  Private
exports.getUserOffers = async (req, res) => {
  try {
    const query = req.user.role === 'buyer' 
      ? { buyer: req.user._id } 
      : { farmer: req.user._id };

    const offers = await Offer.find(query)
      .populate('crop', 'cropName category pricePerUnit unit quantity')
      .populate('buyer', 'name email phone location')
      .populate('farmer', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update offer status (Accept, Reject, Counter)
// @route   PATCH /api/offers/:id/status
// @access  Private (Farmer owner)
exports.updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'rejected', 'countered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid offer status value',
      });
    }

    const offer = await Offer.findById(req.params.id).populate('crop');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
    }

    // Only farmer can accept/reject/counter
    if (offer.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this offer',
      });
    }

    offer.status = status;
    await offer.save();

    // If accepted, automatically generate an order
    let order = null;
    if (status === 'accepted') {
      order = await Order.create({
        crop: offer.crop._id,
        buyer: offer.buyer,
        farmer: offer.farmer,
        offer: offer._id,
        quantity: offer.quantity,
        pricePerUnit: offer.offeredPrice,
        totalAmount: offer.totalAmount || offer.offeredPrice * offer.quantity,
        paymentStatus: 'pending',
        orderStatus: 'placed',
      });
    }

    res.status(200).json({
      success: true,
      message: `Offer ${status} successfully`,
      offer,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
