const MarketPrice = require('../models/MarketPrice');

// @desc    Get latest market prices with filters
// @route   GET /api/prices
// @access  Public
exports.getMarketPrices = async (req, res) => {
  try {
    const { cropName, state, district, market } = req.query;
    let query = {};

    if (cropName) query.cropName = new RegExp(cropName, 'i');
    if (state) query.state = new RegExp(state, 'i');
    if (district) query.district = new RegExp(district, 'i');
    if (market) query.market = new RegExp(market, 'i');

    const prices = await MarketPrice.find(query).sort({ priceDate: -1, createdAt: -1 }).limit(100);

    res.status(200).json({
      success: true,
      count: prices.length,
      data: prices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get market prices for a specific crop across mandis
// @route   GET /api/prices/:cropName
// @access  Public
exports.getPriceByCrop = async (req, res) => {
  try {
    const { cropName } = req.params;
    const prices = await MarketPrice.find({
      cropName: new RegExp(`^${cropName}$`, 'i'),
    }).sort({ priceDate: -1 });

    res.status(200).json({
      success: true,
      cropName,
      count: prices.length,
      data: prices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add market / Mandi price record
// @route   POST /api/prices
// @access  Private (Admin)
exports.addMarketPrice = async (req, res) => {
  try {
    const marketPrice = await MarketPrice.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Market price record added successfully',
      data: marketPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get price trends for a crop over time
// @route   GET /api/prices/trends/:cropName
// @access  Public
exports.getPriceTrends = async (req, res) => {
  try {
    const { cropName } = req.params;
    const trends = await MarketPrice.find({
      cropName: new RegExp(`^${cropName}$`, 'i'),
    })
      .sort({ priceDate: 1 })
      .select('modalPrice minPrice maxPrice priceDate market')
      .limit(30);

    res.status(200).json({
      success: true,
      cropName,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
