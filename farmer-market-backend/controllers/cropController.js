const Crop = require('../models/Crop');

// @desc    Get all crops with optional filtering
// @route   GET /api/crops
// @access  Public
exports.getAllCrops = async (req, res) => {
  try {
    const { category, search, district, state, status } = req.query;
    let query = {};

    if (category) query.category = category;
    if (district) query['location.district'] = new RegExp(district, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');
    if (status) query.status = status;
    else query.status = 'available'; // Default to available crops

    if (search) {
      query.cropName = { $regex: search, $options: 'i' };
    }

    const crops = await Crop.find(query)
      .populate('farmer', 'name phone email location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
// @access  Public
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate(
      'farmer',
      'name phone email location'
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop listing not found',
      });
    }

    res.status(200).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a new crop listing
// @route   POST /api/crops
// @access  Private (Farmer, Admin)
exports.createCrop = async (req, res) => {
  try {
    const cropData = {
      ...req.body,
      farmer: req.user._id,
    };

    const crop = await Crop.create(cropData);

    res.status(201).json({
      success: true,
      message: 'Crop listing created successfully',
      data: crop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update crop listing
// @route   PUT /api/crops/:id
// @access  Private (Farmer owner or Admin)
exports.updateCrop = async (req, res) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop listing not found',
      });
    }

    // Check ownership
    if (crop.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this listing',
      });
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Crop listing updated successfully',
      data: crop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete crop listing
// @route   DELETE /api/crops/:id
// @access  Private (Farmer owner or Admin)
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop listing not found',
      });
    }

    // Check ownership
    if (crop.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing',
      });
    }

    await crop.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Crop listing removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get crops listed by the logged-in farmer
// @route   GET /api/crops/my/listings
// @access  Private (Farmer)
exports.getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
