const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const MarketPrice = require('./models/MarketPrice');

const CSV_PATH = path.join(__dirname, '..', 'data', 'market_prices.csv');
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

        const csvData = fs.readFileSync(CSV_PATH, 'utf8');
        const lines = csvData.trim().split('\n');

        const records = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 11) {
                records.push({
                    date: new Date(values[0]),
                    commodity: values[1],
                    state: values[2],
                    district: values[3],
                    market: values[4],
                    variety: values[5],
                    grade: values[6],
                    minPrice: Number(values[7]),
                    maxPrice: Number(values[8]),
                    modalPrice: Number(values[9]),
                    arrivalQuantity: Number(values[10])
                });
            }
        }

        await MarketPrice.insertMany(records);
        console.log(`Successfully seeded ${records.length} historical market price records!`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
