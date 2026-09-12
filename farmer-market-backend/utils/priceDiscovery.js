const discoverPriceLogic = (prices, cropName) => {
    if (!prices || prices.length === 0) {
        return null;
    }

    let highestAvailablePrice = 0;
    let lowestAvailablePrice = Infinity;
    let totalPriceSum = 0;
    let bestMarketObj = null;
    let lowestMarketObj = null;

    const marketComparison = prices.map((item) => {
        const modal = item.modalPrice;
        totalPriceSum += modal;

        if (modal > highestAvailablePrice) {
            highestAvailablePrice = modal;
            bestMarketObj = {
                marketName: item.marketName,
                state: item.state,
                district: item.district,
                price: item.modalPrice,
                unit: item.unit || 'Quintal'
            };
        }

        if (modal < lowestAvailablePrice) {
            lowestAvailablePrice = modal;
            lowestMarketObj = {
                marketName: item.marketName,
                state: item.state,
                district: item.district,
                price: item.modalPrice,
                unit: item.unit || 'Quintal'
            };
        }

        return {
            marketName: item.marketName,
            state: item.state,
            district: item.district,
            modalPrice: item.modalPrice,
            minPrice: item.minPrice,
            maxPrice: item.maxPrice,
            unit: item.unit || 'Quintal',
            date: item.date
        };
    });

    const averagePrice = Math.round(totalPriceSum / prices.length);
    const recommendedPrice = averagePrice;

    return {
        crop: cropName,
        averagePrice,
        recommendedPrice,
        highestAvailablePrice,
        lowestAvailablePrice,
        bestMarket: bestMarketObj,
        lowestMarket: lowestMarketObj,
        marketsCompared: prices.length,
        marketComparison
    };
};

module.exports = { discoverPriceLogic };
