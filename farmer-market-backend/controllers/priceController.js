const MarketPrice = require('../models/MarketPrice');
const { discoverPriceLogic } = require('../utils/priceDiscovery');
const { fetchLiveMandiPrices } = require('../services/mandiApiService');


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

exports.getPriceHistory = async (req, res, next) => {
    try {
        const { commodity, crop, market } = req.query;
        const cropTarget = commodity || crop;
        let query = {};

        if (cropTarget) {
            query.$or = [
                { commodity: { $regex: cropTarget, $options: 'i' } },
                { cropName: { $regex: cropTarget, $options: 'i' } }
            ];
        }
        if (market) {
            const marketFilter = { $regex: market, $options: 'i' };
            if (query.$or) {
                query = {
                    $and: [
                        { $or: query.$or },
                        { $or: [{ market: marketFilter }, { marketName: marketFilter }] }
                    ]
                };
            } else {
                query.$or = [{ market: marketFilter }, { marketName: marketFilter }];
            }
        }

        const history = await MarketPrice.find(query).sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        next(error);
    }
};

exports.getPriceComparison = async (req, res, next) => {
    try {
        const { commodity, crop } = req.query;
        const targetCrop = commodity || crop;

        if (!targetCrop) {
            return res.status(400).json({ success: false, message: 'Commodity query parameter is required' });
        }

        const prices = await MarketPrice.aggregate([
            {
                $match: {
                    $or: [
                        { commodity: { $regex: targetCrop, $options: 'i' } },
                        { cropName: { $regex: targetCrop, $options: 'i' } }
                    ]
                }
            },
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: { $ifNull: ["$market", "$marketName"] },
                    latestPrice: { $first: "$modalPrice" },
                    minPrice: { $first: "$minPrice" },
                    maxPrice: { $first: "$maxPrice" },
                    state: { $first: "$state" },
                    district: { $first: "$district" },
                    date: { $first: "$date" },
                    arrivalQuantity: { $first: "$arrivalQuantity" }
                }
            },
            { $sort: { latestPrice: -1 } }
        ]);

        if (prices.length === 0) {
            return res.status(404).json({ success: false, message: `No markets found for ${targetCrop}` });
        }

        let totalPriceSum = 0;
        let highest = prices[0];
        let lowest = prices[prices.length - 1];

        prices.forEach(p => totalPriceSum += (p.latestPrice || 0));
        const averagePrice = Math.round(totalPriceSum / prices.length);

        res.status(200).json({
            success: true,
            commodity: targetCrop,
            averagePrice,
            bestMarket: {
                marketName: highest._id,
                state: highest.state,
                district: highest.district,
                price: highest.latestPrice
            },
            lowestMarket: {
                marketName: lowest._id,
                state: lowest.state,
                district: lowest.district,
                price: lowest.latestPrice
            },
            marketsCompared: prices.length,
            data: prices
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

exports.getLiveMandiPrices = async (req, res, next) => {
    try {
        const { state = 'Maharashtra', commodity = 'Onion' } = req.query;
        const liveResult = await fetchLiveMandiPrices(state, commodity);
        
        // Optional background sync to DB if DB is available
        if (liveResult.data && Array.isArray(liveResult.data)) {
            MarketPrice.bulkWrite(
                liveResult.data.map(item => ({
                    updateOne: {
                        filter: { 
                            marketName: item.market || item.marketName, 
                            cropName: item.commodity || item.cropName, 
                            date: item.arrival_date || item.date || new Date().toISOString().split('T')[0]
                        },
                        update: {
                            $set: {
                                cropName: item.commodity || item.cropName,
                                marketName: item.market || item.marketName,
                                state: item.state,
                                district: item.district,
                                date: item.arrival_date || item.date || new Date().toISOString().split('T')[0],
                                minPrice: item.min_price || item.minPrice || 0,
                                maxPrice: item.max_price || item.maxPrice || 0,
                                modalPrice: item.modal_price || item.modalPrice || 0,
                                unit: item.unit || 'Quintal'
                            }
                        },
                        upsert: true
                    }
                }))
            ).catch(err => console.warn('[DB Sync Warn] Non-fatal bulkWrite error:', err.message));
        }

        res.status(200).json({
            success: true,
            message: `Fetched live Mandi prices for ${commodity} in ${state}`,
            source: liveResult.source,
            isFallback: liveResult.isFallback || false,
            count: liveResult.count || liveResult.data.length,
            data: liveResult.data
        });
    } catch (error) {
        next(error);
    }
};

