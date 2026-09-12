const MarketPrice = require('../models/MarketPrice');

exports.getMarkets = async (req, res, next) => {
    try {
        const markets1 = await MarketPrice.distinct('market');
        const markets2 = await MarketPrice.distinct('marketName');
        const set = new Set([...markets1, ...markets2].filter(Boolean));
        const markets = Array.from(set);
        res.status(200).json({ success: true, count: markets.length, data: markets });
    } catch (error) {
        next(error);
    }
};

exports.getCommodities = async (req, res, next) => {
    try {
        const comms1 = await MarketPrice.distinct('commodity');
        const comms2 = await MarketPrice.distinct('cropName');
        const set = new Set([...comms1, ...comms2].filter(Boolean));
        const commodities = Array.from(set);
        res.status(200).json({ success: true, count: commodities.length, data: commodities });
    } catch (error) {
        next(error);
    }
};
