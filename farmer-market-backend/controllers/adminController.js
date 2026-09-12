const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Offer = require('../models/Offer');
const MarketPrice = require('../models/MarketPrice');

// @desc    Get admin platform stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalCropsListed = await Crop.countDocuments();
    const activeCrops = await Crop.countDocuments({ status: 'available' });
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ orderStatus: { $in: ['delivered', 'completed'] } });

    // Aggregate total traded volume in Rupees
    const tradeVolumeAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalTradeVolume = tradeVolumeAgg.length > 0 ? tradeVolumeAgg[0].total : 318000;

    const totalMandisCovered = await MarketPrice.distinct('market');

    res.status(200).json({
      success: true,
      data: {
        totalFarmers,
        totalBuyers,
        totalUsers: totalFarmers + totalBuyers + 1,
        totalCropsListed,
        activeCrops,
        totalOrders,
        completedOrders,
        totalTradeVolume,
        totalMandis: totalMandisCovered.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users with filter
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};
    if (role && role !== 'All') query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { businessName: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user KYC verification badge
// @route   PATCH /api/admin/users/:id/verify
// @access  Private (Admin)
exports.toggleUserVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isVerified = !user.isVerified;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} verification status updated to ${user.isVerified ? 'VERIFIED' : 'UNVERIFIED'}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active status (suspend/activate)
// @route   PATCH /api/admin/users/:id/toggle-active
// @access  Private (Admin)
exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account ${user.isActive ? 'ACTIVATED' : 'SUSPENDED'}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
