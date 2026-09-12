const Offer = require('../models/Offer');
const Crop = require('../models/Crop');
const Order = require('../models/Order');

exports.createOffer = async (req, res, next) => {
    try {
        const { cropId, offeredPrice, quantity, message } = req.body;

        if (!cropId || !offeredPrice || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'cropId, offeredPrice, and quantity are required',
                error: 'Bad Request'
            });
        }

        if (offeredPrice <= 0 || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'offeredPrice and quantity must be positive numbers',
                error: 'Bad Request'
            });
        }

        const crop = await Crop.findById(cropId);
        if (!crop) {
            return res.status(404).json({
                success: false,
                message: 'Crop listing not found',
                error: 'Not Found'
            });
        }

        if (crop.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Crop is not currently available for offers',
                error: 'Bad Request'
            });
        }

        if (quantity > crop.quantity) {
            return res.status(400).json({
                success: false,
                message: `Offered quantity (${quantity}) exceeds available crop quantity (${crop.quantity})`,
                error: 'Validation Error'
            });
        }

        const offer = await Offer.create({
            cropId,
            farmerId: crop.farmerId,
            buyerId: req.user._id,
            offeredPrice,
            quantity,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Offer submitted successfully',
            data: offer
        });
    } catch (error) {
        next(error);
    }
};

exports.getFarmerOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find({ farmerId: req.user._id })
            .populate('cropId', 'cropName expectedPrice unit location status')
            .populate('buyerId', 'name email phone location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Received offers fetched successfully',
            count: offers.length,
            data: offers
        });
    } catch (error) {
        next(error);
    }
};

exports.getBuyerOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find({ buyerId: req.user._id })
            .populate('cropId', 'cropName expectedPrice unit location status')
            .populate('farmerId', 'name email phone location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Sent offers fetched successfully',
            count: offers.length,
            data: offers
        });
    } catch (error) {
        next(error);
    }
};

exports.acceptOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found',
                error: 'Not Found'
            });
        }

        if (offer.farmerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to accept this offer',
                error: 'Forbidden'
            });
        }

        if (offer.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Offer is already ${offer.status}`,
                error: 'Bad Request'
            });
        }

        const crop = await Crop.findById(offer.cropId);
        if (!crop) {
            return res.status(404).json({
                success: false,
                message: 'Associated crop listing not found',
                error: 'Not Found'
            });
        }

        if (crop.quantity < offer.quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient crop quantity available to fulfill this offer',
                error: 'Validation Error'
            });
        }

        // Accept offer
        offer.status = 'accepted';
        await offer.save();

        // Create Order
        const order = await Order.create({
            cropId: offer.cropId,
            farmerId: offer.farmerId,
            buyerId: offer.buyerId,
            quantity: offer.quantity,
            finalPrice: offer.offeredPrice,
            status: 'confirmed'
        });

        // Reduce crop quantity
        crop.quantity -= offer.quantity;
        if (crop.quantity <= 0) {
            crop.quantity = 0;
            crop.status = 'sold';
        }
        await crop.save();

        // Invalidate or reject pending offers that exceed newly reduced crop quantity
        if (crop.quantity === 0) {
            await Offer.updateMany(
                { cropId: crop._id, status: 'pending', _id: { $ne: offer._id } },
                { status: 'rejected' }
            );
        } else {
            const pendingOffers = await Offer.find({ cropId: crop._id, status: 'pending', _id: { $ne: offer._id } });
            for (let pendingOffer of pendingOffers) {
                if (pendingOffer.quantity > crop.quantity) {
                    pendingOffer.status = 'rejected';
                    await pendingOffer.save();
                }
            }
        }

        res.status(200).json({
            success: true,
            message: 'Offer accepted and Order generated successfully',
            data: {
                offer,
                order,
                remainingCropQuantity: crop.quantity,
                cropStatus: crop.status
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.rejectOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found',
                error: 'Not Found'
            });
        }

        if (offer.farmerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to reject this offer',
                error: 'Forbidden'
            });
        }

        offer.status = 'rejected';
        await offer.save();

        res.status(200).json({
            success: true,
            message: 'Offer rejected',
            data: offer
        });
    } catch (error) {
        next(error);
    }
};
