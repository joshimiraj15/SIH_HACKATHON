const Crop = require('../models/Crop');

exports.createCrop = async (req, res, next) => {
    try {
        const { cropName, quantity, unit, expectedPrice, location, harvestDate, description } = req.body;

        if (!cropName || quantity === undefined || expectedPrice === undefined || !location) {
            return res.status(400).json({
                success: false,
                message: 'Crop name, quantity, expected price, and location are required',
                error: 'Bad Request'
            });
        }

        if (quantity <= 0 || expectedPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity and expected price must be positive numbers',
                error: 'Bad Request'
            });
        }

        const crop = await Crop.create({
            farmerId: req.user._id,
            cropName,
            quantity,
            unit: unit || 'Quintal',
            expectedPrice,
            location,
            harvestDate,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Crop added successfully',
            data: crop
        });
    } catch (error) {
        next(error);
    }
};

exports.getCrops = async (req, res, next) => {
    try {
        const { crop, location, minPrice, maxPrice, status } = req.query;

        let query = {};

        if (status) {
            query.status = status;
        } else {
            query.status = 'available';
        }

        if (crop) {
            query.cropName = { $regex: crop, $options: 'i' };
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            query.expectedPrice = {};
            if (minPrice) query.expectedPrice.$gte = Number(minPrice);
            if (maxPrice) query.expectedPrice.$lte = Number(maxPrice);
        }

        const crops = await Crop.find(query)
            .populate('farmerId', 'name email phone location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Crops fetched successfully',
            count: crops.length,
            data: crops
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyCrops = async (req, res, next) => {
    try {
        const crops = await Crop.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Farmer crops fetched successfully',
            count: crops.length,
            data: crops
        });
    } catch (error) {
        next(error);
    }
};

exports.searchCrops = async (req, res, next) => {
    try {
        const { crop } = req.query;
        if (!crop) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter "crop" is required',
                error: 'Bad Request'
            });
        }

        const crops = await Crop.find({
            cropName: { $regex: crop, $options: 'i' },
            status: 'available'
        }).populate('farmerId', 'name email phone location');

        res.status(200).json({
            success: true,
            message: `Search results for '${crop}'`,
            count: crops.length,
            data: crops
        });
    } catch (error) {
        next(error);
    }
};

exports.getCropById = async (req, res, next) => {
    try {
        const crop = await Crop.findById(req.params.id).populate('farmerId', 'name email phone location');

        if (!crop) {
            return res.status(404).json({
                success: false,
                message: 'Crop listing not found',
                error: 'Not Found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Crop details retrieved',
            data: crop
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCrop = async (req, res, next) => {
    try {
        let crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({
                success: false,
                message: 'Crop listing not found',
                error: 'Not Found'
            });
        }

        if (crop.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this crop listing',
                error: 'Forbidden'
            });
        }

        crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Crop updated successfully',
            data: crop
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCrop = async (req, res, next) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({
                success: false,
                message: 'Crop listing not found',
                error: 'Not Found'
            });
        }

        if (crop.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this crop listing',
                error: 'Forbidden'
            });
        }

        await crop.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Crop listing deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
