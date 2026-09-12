const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const MarketPrice = require('./models/MarketPrice');

const CSV_PATH = path.join(__dirname, '..', 'farmer-price-discovery', 'data', 'market_prices.csv');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/farmer_market';

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected for Seeding...');

        // Clear existing prices
        await MarketPrice.deleteMany({});

        if (!fs.existsSync(CSV_PATH)) {
            console.error('CSV file not found at', CSV_PATH);
            process.exit(1);
        }

        const csvData = fs.readFileSync(CSV_PATH, 'utf8');
        const lines = csvData.trim().split('\n');

        const records = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 11) {
                const commodityName = values[1].trim();
                const marketNameVal = values[4].trim();
                records.push({
                    date: new Date(values[0].trim()),
                    commodity: commodityName,
                    cropName: commodityName,
                    state: values[2].trim(),
                    district: values[3].trim(),
                    market: marketNameVal,
                    marketName: marketNameVal,
                    variety: values[5].trim(),
                    grade: values[6].trim(),
                    minPrice: Number(values[7].trim()),
                    maxPrice: Number(values[8].trim()),
                    modalPrice: Number(values[9].trim()),
                    arrivalQuantity: Number(values[10].trim()),
                    unit: 'Quintal'
                });
            }
        }

        await MarketPrice.insertMany(records);
        console.log(`Successfully seeded ${records.length} historical APMC market price records!`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
