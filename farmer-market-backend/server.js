const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
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

// API Mount Points
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/offers', offerRoutes);

// Health check / welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Farmer Market (Kisan Setu) Backend API',
    endpoints: {
      auth: '/api/auth',
      crops: '/api/crops',
      prices: '/api/prices',
      offers: '/api/offers',
    },
    version: '1.0.0',
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
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Farmer Market Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
