require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/prices', require('./routes/priceRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));
app.use('/api', require('./routes/marketRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/ml', require('./routes/predictionRoutes'));

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Farmer Price Discovery & Prediction Node.js API Service Running...' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Node.js Backend Server running on port ${PORT}`);
});
