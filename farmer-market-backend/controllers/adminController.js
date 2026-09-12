const User = require('../models/User');
const Crop = require('../models/Crop');
const Offer = require('../models/Offer');
const Order = require('../models/Order');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'All users fetched',
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

exports.getFarmers = async (req, res, next) => {
    try {
        const farmers = await User.find({ role: 'farmer' }).select('-password').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Farmers list fetched',
            count: farmers.length,
            data: farmers
        });
    } catch (error) {
        next(error);
    }
};

exports.getBuyers = async (req, res, next) => {
    try {
        const buyers = await User.find({ role: 'buyer' }).select('-password').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Buyers list fetched',
            count: buyers.length,
            data: buyers
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCrops = async (req, res, next) => {
    try {
        const crops = await Crop.find().populate('farmerId', 'name email phone').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'All crops fetched',
            count: crops.length,
            data: crops
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find()
            .populate('cropId', 'cropName')
            .populate('farmerId', 'name email')
            .populate('buyerId', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'All offers fetched',
            count: offers.length,
            data: offers
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('cropId', 'cropName')
            .populate('farmerId', 'name email')
            .populate('buyerId', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'All orders fetched',
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalFarmers = await User.countDocuments({ role: 'farmer' });
        const totalBuyers = await User.countDocuments({ role: 'buyer' });
        const totalCrops = await Crop.countDocuments();
        const totalAvailableCrops = await Crop.countDocuments({ status: 'available' });
        const totalOffers = await Offer.countDocuments();
        const totalOrders = await Order.countDocuments();
        const completedOrders = await Order.countDocuments({ status: 'completed' });

        res.status(200).json({
            success: true,
            message: 'Admin dashboard statistics',
            data: {
                totalFarmers,
                totalBuyers,
                totalCrops,
                totalAvailableCrops,
                totalOffers,
                totalOrders,
                completedOrders
            }
        });
    } catch (error) {
        next(error);
    }
};
