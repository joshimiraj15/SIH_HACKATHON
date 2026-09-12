const GovernmentScheme = require('../models/GovernmentScheme');

// @desc    Get all government schemes & subsidies
// @route   GET /api/schemes
// @access  Public
exports.getSchemes = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    const schemes = await GovernmentScheme.find(query).sort({ category: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get MSP official rates comparison
// @route   GET /api/schemes/msp-rates
// @access  Public
exports.getMspRates = async (req, res) => {
  try {
    const mspSchemes = await GovernmentScheme.find({ category: 'MSP' });
    const mspList = mspSchemes
      .filter((s) => s.mspCropDetails && s.mspCropDetails.cropName)
      .map((s) => ({
        id: s._id,
        crop: s.mspCropDetails.cropName,
        season: s.mspCropDetails.season,
        msp2023_24: s.mspCropDetails.msp2023_24,
        msp2024_25: s.mspCropDetails.msp2024_25,
        msp2025_26: s.mspCropDetails.msp2025_26,
        marketPriceAvg: s.mspCropDetails.marketPriceAvg,
        unit: s.mspCropDetails.unit,
        marginOverCostPercent: 105,
        portalUrl: s.portalUrl,
      }));

    res.status(200).json({
      success: true,
      data: mspList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
