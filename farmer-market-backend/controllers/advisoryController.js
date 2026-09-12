const CropAdvisory = require('../models/CropAdvisory');

// @desc    Get crop advisories (diseases, pest control, fertilizers)
// @route   GET /api/advisory
// @access  Public
exports.getAdvisories = async (req, res) => {
  try {
    const { cropName, category, season, severity } = req.query;
    let query = {};

    if (cropName && cropName !== 'All') query.cropName = new RegExp(cropName, 'i');
    if (category && category !== 'All') query.category = category;
    if (season && season !== 'All') query.season = season;
    if (severity) query.severity = severity;

    const advisories = await CropAdvisory.find(query).sort({ severity: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: advisories.length,
      data: advisories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add advisory record (Admin/Agri-Expert)
// @route   POST /api/advisory
// @access  Private (Admin)
exports.createAdvisory = async (req, res) => {
  try {
    const advisory = await CropAdvisory.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Crop advisory added successfully',
      data: advisory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
