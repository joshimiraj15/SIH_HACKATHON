/**
 * Integration Test Suite for KisanSetu Node.js Express API
 */
const { fetchLiveMandiPrices } = require('../services/mandiApiService');
const { generateFarmerAIResponse } = require('../services/geminiService');

describe('KisanSetu Express Backend API Test Suite', () => {
  
  test('Mandi API Service fetches live prices for Maharashtra & Onion', async () => {
    const res = await fetchLiveMandiPrices('Maharashtra', 'Onion');
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0]).toHaveProperty('modal_price');
  }, 15000);

  test('Gemini RAG Service generates Gujarati agricultural response', async () => {
    const res = await generateFarmerAIResponse({
      prompt: 'આજે ટામેટાના ભાવ કેટલા છે?',
      language: 'gu',
      state: 'Maharashtra'
    });
    expect(res.success).toBe(true);
    expect(res.answer).toBeDefined();
    expect(typeof res.answer).toBe('string');
  }, 15000);

  test('Gemini RAG Service generates English response', async () => {
    const res = await generateFarmerAIResponse({
      prompt: 'What is today wheat market rate?',
      language: 'en',
      state: 'Gujarat'
    });
    expect(res.success).toBe(true);
    expect(res.answer.length).toBeGreaterThan(10);
  }, 15000);

});
