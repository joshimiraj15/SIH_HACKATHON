require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Kishan Setu — Unified Marketplace, ML Forecasting & Price Discovery API is running...'
    });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/prices', require('./routes/priceRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api', require('./routes/marketRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Unified Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
