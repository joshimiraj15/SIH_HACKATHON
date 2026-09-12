const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const fs = require('fs');

const User = require('./models/User');
const Crop = require('./models/Crop');
const MarketPrice = require('./models/MarketPrice');
const Offer = require('./models/Offer');

const CSV_PATH = path.join(__dirname, '..', 'farmer-price-discovery', 'data', 'market_prices.csv');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/farmer_market';

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB at:', MONGO_URI);
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected Successfully!');

        // 1. Find or create default user (Joshi Miraj)
        let farmer = await User.findOne({ email: 'joshimiraj515@gmail.com' });
        if (!farmer) {
            farmer = await User.create({
                name: 'Joshi Miraj',
                email: 'joshimiraj515@gmail.com',
                password: 'password123',
                phone: '+91 98765 43210',
                location: 'Rajkot, Gujarat',
                role: 'farmer'
            });
            console.log('✅ Created Farmer User:', farmer.name);
        } else {
            console.log('✅ Found Existing Farmer User:', farmer.name);
        }

        // 2. Create Buyer User
        let buyer = await User.findOne({ email: 'sardar.agro@gmail.com' });
        if (!buyer) {
            buyer = await User.create({
                name: 'Sardar Agro Mandi Traders',
                email: 'sardar.agro@gmail.com',
                password: 'password123',
                phone: '+91 98250 11223',
                location: 'Gondal, Rajkot',
                role: 'buyer'
            });
            console.log('✅ Created Buyer User:', buyer.name);
        }

        // 3. Clear and insert Farmer Crops
        await Crop.deleteMany({ farmerId: farmer._id });
        const cropsData = [
            {
                farmerId: farmer._id,
                cropName: 'Cotton (કપાસ)',
                quantity: 450,
                unit: 'Quintal',
                expectedPrice: 6800,
                location: 'Rajkot, Gujarat',
                harvestDate: new Date('2026-09-10'),
                description: 'Premium Grade Shankar-6 Cotton Lot listed by Joshi Miraj',
                status: 'available'
            },
            {
                farmerId: farmer._id,
                cropName: 'Groundnut (મગફળી GG-20)',
                quantity: 280,
                unit: 'Quintal',
                expectedPrice: 6150,
                location: 'Gondal APMC, Gujarat',
                harvestDate: new Date('2026-09-08'),
                description: 'High Oil Content Grade A Groundnut produce lot',
                status: 'available'
            },
            {
                farmerId: farmer._id,
                cropName: 'Wheat (શરબતી ઘઉં)',
                quantity: 600,
                unit: 'Quintal',
                expectedPrice: 3200,
                location: 'Rajkot Yard, Gujarat',
                harvestDate: new Date('2026-09-05'),
                description: 'Organic Golden Sharbati Wheat, Cleaned and Bagged',
                status: 'available'
            },
            {
                farmerId: farmer._id,
                cropName: 'Tomato (હાઈબ્રીડ ટામેટા)',
                quantity: 120,
                unit: 'Quintal',
                expectedPrice: 2550,
                location: 'Ahmedabad Road, Gujarat',
                harvestDate: new Date('2026-09-12'),
                description: 'Fresh Farm Plucked Red Ripe Hybrid Tomatoes',
                status: 'available'
            }
        ];

        const insertedCrops = await Crop.insertMany(cropsData);
        console.log(`✅ Saved ${insertedCrops.length} Crops in MongoDB 'crops' collection!`);

        // 4. Create Buyer Offers on the crops
        await Offer.deleteMany({ cropId: { $in: insertedCrops.map(c => c._id) } });
        const offersData = [
            {
                cropId: insertedCrops[0]._id,
                farmerId: farmer._id,
                buyerId: buyer._id,
                offeredPrice: 6750,
                quantity: 300,
                status: 'pending',
                message: 'Immediate payment upon delivery at Gondal Hub'
            },
            {
                cropId: insertedCrops[1]._id,
                farmerId: farmer._id,
                buyerId: buyer._id,
                offeredPrice: 6200,
                quantity: 280,
                status: 'accepted',
                message: 'Full lot booking, transport arranged by buyer'
            }
        ];
        const insertedOffers = await Offer.insertMany(offersData);
        console.log(`✅ Saved ${insertedOffers.length} Buyer Offers in MongoDB 'offers' collection!`);

        // 5. Seed Market Prices from CSV
        if (fs.existsSync(CSV_PATH)) {
            await MarketPrice.deleteMany({});
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
            console.log(`✅ Saved ${records.length} APMC Market Price records in MongoDB 'marketprices' collection!`);
        }

        console.log('\n🎉 All MongoDB collections have been populated and saved successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during seeding:', err);
        process.exit(1);
    }
};

seedDatabase();
