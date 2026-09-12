const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';

exports.getPredictionFromML = async (commodity, market) => {
    try {
        const response = await axios.post(`${ML_API_URL}/predict`, {
            commodity,
            market
        }, { timeout: 10000 });
        return response.data;
    } catch (error) {
        console.error('ML API Error:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'ML Prediction Service error');
    }
};

exports.triggerModelRetrain = async () => {
    try {
        const response = await axios.post(`${ML_API_URL}/train`, {}, { timeout: 30000 });
        return response.data;
    } catch (error) {
        console.error('ML Retrain Error:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'ML Training Service error');
    }
};
