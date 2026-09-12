const Crop = require('../models/Crop');

// @desc    Get all available crops for marketplace
// @route   GET /api/crops
// @access  Public
exports.getAllCrops = async (req, res) => {
  try {
    const { category, search, district, state, status, minPrice, maxPrice } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (district) query['location.district'] = new RegExp(district, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');
    if (status) query.status = status;
    else query.status = 'available';

    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { cropName: { $regex: search, $options: 'i' } },
        { variety: { $regex: search, $options: 'i' } },
        { 'location.district': { $regex: search, $options: 'i' } },
      ];
    }

    const crops = await Crop.find(query)
      .populate('farmer', 'name phone email businessName isVerified rating reviewsCount location')
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

// @desc    Get single crop listing
// @route   GET /api/crops/:id
// @access  Public
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate(
      'farmer',
      'name phone email businessName isVerified rating reviewsCount location totalDeals'
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

// @desc    Create a new crop produce listing
// @route   POST /api/crops
// @access  Private (Farmer, Admin)
exports.createCrop = async (req, res) => {
  try {
    const cropData = {
      ...req.body,
      farmer: req.user._id,
      location: req.body.location || req.user.location,
    };

    const crop = await Crop.create(cropData);

    res.status(201).json({
      success: true,
      message: 'Produce listing created successfully',
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
        message: 'Crop not found',
      });
    }

    if (crop.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing',
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
        message: 'Crop not found',
      });
    }

    if (crop.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
    }

    await Crop.findByIdAndDelete(req.params.id);

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
