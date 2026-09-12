const MarketPrice = require('../models/MarketPrice');

exports.getPrices = async (req, res, next) => {
    try {
        const { commodity, state, district, market, limit } = req.query;

        let query = {};
        if (commodity) query.commodity = { $regex: commodity, $options: 'i' };
        if (state) query.state = { $regex: state, $options: 'i' };
        if (district) query.district = { $regex: district, $options: 'i' };
        if (market) query.market = { $regex: market, $options: 'i' };

        const prices = await MarketPrice.find(query)
            .sort({ date: -1 })
            .limit(Number(limit) || 100);

        res.status(200).json({
            success: true,
            count: prices.length,
            data: prices
        });
    } catch (error) {
        next(error);
    }
};

exports.getPriceHistory = async (req, res, next) => {
    try {
        const { commodity, market } = req.query;
        let query = {};

        if (commodity) query.commodity = { $regex: commodity, $options: 'i' };
        if (market) query.market = { $regex: market, $options: 'i' };

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
        const { commodity } = req.query;

        if (!commodity) {
            return res.status(400).json({ success: false, message: 'Commodity query parameter is required' });
        }

        const prices = await MarketPrice.aggregate([
            { $match: { commodity: { $regex: commodity, $options: 'i' } } },
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: "$market",
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
            return res.status(404).json({ success: false, message: `No markets found for ${commodity}` });
        }

        let totalPriceSum = 0;
        let highest = prices[0];
        let lowest = prices[prices.length - 1];

        prices.forEach(p => totalPriceSum += p.latestPrice);
        const averagePrice = Math.round(totalPriceSum / prices.length);

        res.status(200).json({
            success: true,
            commodity,
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
