const PriceAlert = require('../models/PriceAlert');
const MarketPrice = require('../models/MarketPrice');

// @desc    Get user price alerts
// @route   GET /api/alerts
// @access  Private
exports.getUserAlerts = async (req, res) => {
  try {
    const alerts = await PriceAlert.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new price alert
// @route   POST /api/alerts
// @access  Private
exports.createAlert = async (req, res) => {
  try {
    const { cropName, market, condition, targetPrice, notificationType } = req.body;

    // Check current price for this crop
    const currentPriceRecord = await MarketPrice.findOne({
      cropName: new RegExp(cropName, 'i'),
      ...(market && market !== 'All Mandis' ? { market: new RegExp(market, 'i') } : {}),
    }).sort({ priceDate: -1 });

    const currentPrice = currentPriceRecord ? currentPriceRecord.modalPrice : targetPrice;
    const isTriggered =
      condition === 'above' ? currentPrice >= Number(targetPrice) : currentPrice <= Number(targetPrice);

    const alert = await PriceAlert.create({
      user: req.user._id,
      cropName,
      market: market || 'All Mandis',
      condition: condition || 'above',
      targetPrice: Number(targetPrice),
      currentPrice,
      isActive: true,
      isTriggered,
      lastTriggeredAt: isTriggered ? new Date() : null,
      notificationType: notificationType || 'both',
    });

    res.status(201).json({
      success: true,
      message: isTriggered
        ? `Alert created! Current price (₹${currentPrice}) meets your target condition!`
        : `Price alert set! You will be notified when ${cropName} goes ${condition} ₹${targetPrice}`,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle alert status (active/inactive)
// @route   PATCH /api/alerts/:id/toggle
// @access  Private
exports.toggleAlert = async (req, res) => {
  try {
    const alert = await PriceAlert.findOne({ _id: req.params.id, user: req.user._id });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.isActive = !alert.isActive;
    await alert.save();

    res.status(200).json({
      success: true,
      message: `Alert ${alert.isActive ? 'activated' : 'paused'}`,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete price alert
// @route   DELETE /api/alerts/:id
// @access  Private
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await PriceAlert.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Alert removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
