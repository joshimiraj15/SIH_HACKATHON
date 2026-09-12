const MarketPrice = require('../models/MarketPrice');

exports.getMarkets = async (req, res, next) => {
    try {
        const markets = await MarketPrice.distinct('market');
        res.status(200).json({ success: true, count: markets.length, data: markets });
    } catch (error) {
        next(error);
    }
};

exports.getCommodities = async (req, res, next) => {
    try {
        const commodities = await MarketPrice.distinct('commodity');
        res.status(200).json({ success: true, count: commodities.length, data: commodities });
    } catch (error) {
        next(error);
    }
};
