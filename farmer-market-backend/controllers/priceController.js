const MarketPrice = require('../models/MarketPrice');

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 25;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

exports.getMarketPrices = async (req, res) => {
  try {
    const { cropName, state, district, market, search } = req.query;
    let query = {};

    if (cropName && cropName !== 'All') query.cropName = new RegExp(cropName, 'i');
    if (state && state !== 'All') query.state = new RegExp(state, 'i');
    if (district) query.district = new RegExp(district, 'i');
    if (market) query.market = new RegExp(market, 'i');
    if (search) {
      query.$or = [
        { cropName: new RegExp(search, 'i') },
        { market: new RegExp(search, 'i') },
        { district: new RegExp(search, 'i') },
      ];
    }

    const prices = await MarketPrice.find(query).sort({ priceDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prices.length,
      data: prices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPriceRadar = async (req, res) => {
  try {
    const { cropName } = req.params;
    const records = await MarketPrice.find({
      cropName: new RegExp(cropName, 'i'),
    }).sort({ modalPrice: -1 });

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No price records found for crop '${cropName}'`,
      });
    }

    const prices = records.map((r) => r.modalPrice);
    const minMandiPrice = Math.min(...prices);
    const maxMandiPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const priceSpread = maxMandiPrice - minMandiPrice;

    res.status(200).json({
      success: true,
      cropName,
      metrics: {
        highestPrice: maxMandiPrice,
        lowestPrice: minMandiPrice,
        averagePrice: avgPrice,
        spread: priceSpread,
        totalMarketsCompared: records.length,
      },
      markets: records.map((m) => ({
        id: m._id,
        market: m.market,
        district: m.district,
        state: m.state,
        modalPrice: m.modalPrice,
        minPrice: m.minPrice,
        maxPrice: m.maxPrice,
        arrivalQuantity: m.arrivalQuantity,
        trend: m.trend,
        spreadDifference: m.modalPrice - avgPrice,
        percentageAboveAvg: Number((((m.modalPrice - avgPrice) / avgPrice) * 100).toFixed(1)),
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWhereToSellRecommendations = async (req, res) => {
  try {
    const { cropName = 'Wheat', quantity = 50, farmerLocation, vehicleType = 'Tractor Trolley' } = req.body;

    const farmerLat = farmerLocation?.lat || 22.3039;
    const farmerLng = farmerLocation?.lng || 70.8022;

    const mandis = await MarketPrice.find({
      cropName: new RegExp(cropName, 'i'),
    });

    if (!mandis || mandis.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No active mandi prices for ${cropName}`,
      });
    }

    const vehicleRates = {
      'Tractor Trolley': 18,
      'Mini Tempo (3 Wheeler)': 14,
      'Medium Truck (7-10 Ton)': 28,
      'Large Truck (16 Ton)': 42,
    };
    const ratePerKm = vehicleRates[vehicleType] || 18;

    const analyzedMandis = mandis.map((mandi) => {
      const distanceKm = calculateDistanceKm(
        farmerLat,
        farmerLng,
        mandi.coordinates?.lat || farmerLat + 0.3,
        mandi.coordinates?.lng || farmerLng + 0.2
      );

      const transportCost = Math.round(distanceKm * 2 * ratePerKm);
      const apmcCess = Math.round(mandi.modalPrice * quantity * 0.015);
      const handlingCost = Math.round(quantity * 8);
      const totalCost = transportCost + apmcCess + handlingCost;

      const grossRevenue = mandi.modalPrice * quantity;
      const netProfit = grossRevenue - totalCost;
      const netInHandPerQuintal = Math.round(netProfit / quantity);

      return {
        id: mandi._id,
        market: mandi.market,
        district: mandi.district,
        state: mandi.state,
        modalPrice: mandi.modalPrice,
        minPrice: mandi.minPrice,
        maxPrice: mandi.maxPrice,
        distanceKm,
        transportCost,
        apmcCess,
        handlingCost,
        totalExpense: totalCost,
        grossRevenue,
        netProfit,
        netInHandPerQuintal,
        trend: mandi.trend,
        arrivalQuantity: mandi.arrivalQuantity,
      };
    });

    analyzedMandis.sort((a, b) => b.netProfit - a.netProfit);

    const bestMandi = analyzedMandis[0];
    const worstMandi = analyzedMandis[analyzedMandis.length - 1];
    const potentialGain = bestMandi.netProfit - worstMandi.netProfit;

    res.status(200).json({
      success: true,
      cropName,
      quantity,
      vehicleType,
      topRecommendation: bestMandi,
      potentialGain,
      comparison: analyzedMandis,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPriceForecast = async (req, res) => {
  try {
    const { cropName } = req.params;
    const currentPrices = await MarketPrice.find({ cropName: new RegExp(cropName, 'i') });
    const basePrice = currentPrices.length > 0 ? currentPrices[0].modalPrice : 2400;

    const forecastPoints = [
      { day: 'Day 1', label: 'Tomorrow', price: Math.round(basePrice * 1.004), confidence: 95 },
      { day: 'Day 3', label: '+3 Days', price: Math.round(basePrice * 1.012), confidence: 91 },
      { day: 'Day 7', label: '1 Week', price: Math.round(basePrice * 1.026), confidence: 88 },
      { day: 'Day 14', label: '2 Weeks', price: Math.round(basePrice * 1.045), confidence: 82 },
      { day: 'Day 21', label: '3 Weeks', price: Math.round(basePrice * 1.038), confidence: 75 },
      { day: 'Day 30', label: '1 Month', price: Math.round(basePrice * 1.058), confidence: 70 },
    ];

    res.status(200).json({
      success: true,
      cropName,
      currentModalPrice: basePrice,
      sentiment: 'Bullish (Upward Trajectory)',
      arrivalTrend: 'Moderate arrivals, festival demand increasing',
      bestTimeToSell: 'Between Day 10 and Day 18 for peak profit margin',
      forecastTrajectory: forecastPoints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addMarketPrice = async (req, res) => {
  try {
    const marketPrice = await MarketPrice.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Market price record added successfully',
      data: marketPrice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
