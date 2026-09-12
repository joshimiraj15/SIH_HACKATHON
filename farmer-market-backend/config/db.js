const mongoose = require('mongoose');
const seedData = require('../utils/seeder');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/farmer_market';

  try {
    console.log(`Connecting to MongoDB at ${primaryUri}...`);
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedData();
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB unavailable (${error.message}).`);
    console.log('🔄 Launching in-memory embedded MongoDB server for instant zero-config experience...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ Embedded MongoDB Server Ready & Connected at ${uri}`);
      await seedData();
    } catch (memErr) {
      console.error('❌ Failed to start embedded MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
