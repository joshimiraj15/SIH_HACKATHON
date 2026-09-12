const MarketPrice = require('../models/MarketPrice');
const { discoverPriceLogic } = require('../utils/priceDiscovery');

exports.addMarketPrice = async (req, res, next) => {
    try {
        const { cropName, marketName, state, district, date, minPrice, maxPrice, modalPrice, unit } = req.body;

        if (!cropName || !marketName || !state || !district || minPrice === undefined || maxPrice === undefined || modalPrice === undefined) {
            return res.status(400).json({
                success: false,
                message: 'All fields (cropName, marketName, state, district, minPrice, maxPrice, modalPrice) are required',
                error: 'Bad Request'
            });
        }

        if (minPrice > modalPrice || modalPrice > maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'Prices must satisfy minPrice <= modalPrice <= maxPrice',
                error: 'Validation Error'
            });
        }

        const priceEntry = await MarketPrice.create({
            cropName,
            marketName,
            state,
            district,
            date: date || Date.now(),
            minPrice,
            maxPrice,
            modalPrice,
            unit: unit || 'Quintal'
        });

        res.status(201).json({
            success: true,
            message: 'Market price entry created successfully',
            data: priceEntry
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllMarketPrices = async (req, res, next) => {
    try {
        const prices = await MarketPrice.find({}).sort({ date: -1 });
        res.status(200).json({
            success: true,
            message: 'Market prices fetched successfully',
            count: prices.length,
            data: prices
        });
    } catch (error) {
        next(error);
    }
};

exports.getPricesByCrop = async (req, res, next) => {
    try {
        const prices = await MarketPrice.find({
            cropName: { $regex: req.params.cropName, $options: 'i' }
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            message: `Market prices for crop '${req.params.cropName}'`,
            count: prices.length,
            data: prices
        });
    } catch (error) {
        next(error);
    }
};

exports.getLatestPriceByCrop = async (req, res, next) => {
    try {
        const latestPrice = await MarketPrice.findOne({
            cropName: { $regex: req.params.cropName, $options: 'i' }
        }).sort({ date: -1 });

        if (!latestPrice) {
            return res.status(404).json({
                success: false,
                message: `No market price data available for '${req.params.cropName}'`,
                error: 'Not Found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Latest price retrieved',
            data: latestPrice
        });
    } catch (error) {
        next(error);
    }
};

exports.searchPrices = async (req, res, next) => {
    try {
        const { crop, state, district, market } = req.query;

        let query = {};
        if (crop) query.cropName = { $regex: crop, $options: 'i' };
        if (state) query.state = { $regex: state, $options: 'i' };
        if (district) query.district = { $regex: district, $options: 'i' };
        if (market) query.marketName = { $regex: market, $options: 'i' };

        const prices = await MarketPrice.find(query).sort({ date: -1 });

        res.status(200).json({
            success: true,
            message: 'Search market prices results',
            count: prices.length,
            data: prices
        });
    } catch (error) {
        next(error);
    }
};

exports.discoverPrice = async (req, res, next) => {
    try {
        const { cropName } = req.params;
        const { state, district } = req.query;

        if (!cropName) {
            return res.status(400).json({
                success: false,
                message: 'cropName is required for price discovery',
                error: 'Bad Request'
            });
        }

        let query = { cropName: { $regex: cropName, $options: 'i' } };
        if (state) query.state = { $regex: state, $options: 'i' };
        if (district) query.district = { $regex: district, $options: 'i' };

        let prices = await MarketPrice.find(query);

        if (prices.length === 0 && (state || district)) {
            prices = await MarketPrice.find({ cropName: { $regex: cropName, $options: 'i' } });
        }

        if (prices.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No market price data available for '${cropName}'`,
                error: 'Not Found'
            });
        }

        const result = discoverPriceLogic(prices, cropName);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteMarketPrice = async (req, res, next) => {
    try {
        const price = await MarketPrice.findById(req.params.id);
        if (!price) {
            return res.status(404).json({
                success: false,
                message: 'Price record not found',
                error: 'Not Found'
            });
        }
        await price.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Market price record deleted',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
