const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./utils/seeder');

// Load environment variables
dotenv.config();

// Connect to MongoDB (Hybrid: primary URI or automatic embedded memory fallback)
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Imports
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const priceRoutes = require('./routes/priceRoutes');
const offerRoutes = require('./routes/offerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chatRoutes = require('./routes/chatRoutes');
const alertRoutes = require('./routes/alertRoutes');
const schemesRoutes = require('./routes/schemesRoutes');
const advisoryRoutes = require('./routes/advisoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// API Mount Points
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// Database re-seed endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await seedData();
    res.status(200).json({ success: true, message: 'Database seeded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Health check / welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KisanSetu (Farmer Market) Backend API is fully operational',
    endpoints: {
      auth: '/api/auth',
      crops: '/api/crops',
      prices: '/api/prices',
      offers: '/api/offers',
      orders: '/api/orders',
      chat: '/api/chat',
      alerts: '/api/alerts',
      schemes: '/api/schemes',
      advisory: '/api/advisory',
      admin: '/api/admin',
      analytics: '/api/analytics',
      seed: '/api/seed',
    },
    version: '2.0.0',
  });
});

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 KisanSetu API Server running on port ${PORT}`);
});

module.exports = app;
