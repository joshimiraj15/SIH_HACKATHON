const Offer = require('../models/Offer');
const Crop = require('../models/Crop');
const Order = require('../models/Order');

// @desc    Create a new offer on a crop (Buyer)
// @route   POST /api/offers
// @access  Private (Buyer)
exports.createOffer = async (req, res) => {
  try {
    const { cropId, offeredPrice, quantity, message, deliveryTerms, paymentTerms } = req.body;

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
      offeredPrice: Number(offeredPrice),
      quantity: Number(quantity),
      totalAmount: Number(offeredPrice) * Number(quantity),
      message,
      deliveryTerms: deliveryTerms || 'Buyer Arranged Transport',
      paymentTerms: paymentTerms || 'Escrow / On Delivery',
      status: 'pending',
    });

    const populatedOffer = await Offer.findById(offer._id)
      .populate('crop', 'cropName category pricePerUnit unit quantity')
      .populate('farmer', 'name email phone businessName location')
      .populate('buyer', 'name email phone businessName location');

    res.status(201).json({
      success: true,
      message: 'Offer submitted successfully to farmer',
      data: populatedOffer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user offers (Farmer sees incoming, Buyer sees outgoing)
// @route   GET /api/offers/my-offers
// @access  Private
exports.getUserOffers = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'buyer') {
      query.buyer = req.user._id;
    } else if (req.user.role === 'farmer') {
      query.farmer = req.user._id;
    }

    const offers = await Offer.find(query)
      .populate('crop', 'cropName category pricePerUnit unit quantity location images')
      .populate('buyer', 'name email phone businessName location rating')
      .populate('farmer', 'name email phone businessName location rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update offer status (Accept, Reject, Counter)
// @route   PATCH /api/offers/:id/status
// @access  Private
exports.updateOfferStatus = async (req, res) => {
  try {
    const { status, counterPrice } = req.body;
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

    // Check authorization: farmer or buyer involved
    const isFarmer = offer.farmer.toString() === req.user._id.toString();
    const isBuyer = offer.buyer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isFarmer && !isBuyer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this offer',
      });
    }

    offer.status = status;
    if (status === 'countered' && counterPrice) {
      offer.counterPrice = Number(counterPrice);
    }
    await offer.save();

    // If accepted, automatically generate an active Order
    let order = null;
    if (status === 'accepted') {
      const finalPrice = offer.counterPrice || offer.offeredPrice;
      const totalAmount = finalPrice * offer.quantity;

      order = await Order.create({
        crop: offer.crop._id,
        buyer: offer.buyer,
        farmer: offer.farmer,
        offer: offer._id,
        quantity: offer.quantity,
        unit: offer.crop?.unit || 'quintal',
        pricePerUnit: finalPrice,
        totalAmount,
        orderStatus: 'confirmed',
        paymentStatus: 'in_escrow',
        paymentMethod: 'Escrow',
        timeline: [
          { status: 'placed', note: 'Offer accepted by farmer', timestamp: new Date() },
          { status: 'confirmed', note: 'Order automatically created and verified in Escrow', timestamp: new Date() },
        ],
      });

      // Update crop quantity if applicable
      if (offer.crop) {
        const remaining = Math.max(0, offer.crop.quantity - offer.quantity);
        await Crop.findByIdAndUpdate(offer.crop._id, {
          quantity: remaining,
          status: remaining === 0 ? 'sold' : 'available',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Offer ${status} successfully`,
      offer,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
