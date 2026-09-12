// src/services/geminiService.js
// Kisan AI Sahayak - Google Gemini API Integration

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6KSnQLwjW_iJ1gLuFOjFMkZLaFdLtHEkBF-igIbBB-a_A';

// Active models with fallback sequence
const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];

/**
 * System prompt tailored for Gujarat & Indian agriculture, APMC mandi intelligence, and farmer advisory
 */
const getSystemInstruction = (language) => {
  const langDirectives = {
    gu: 'મહત્વપૂર્ણ: હંમેશા શુદ્ધ અને સરળ ગુજરાતી ભાષામાં જવાબ આપો. ખેડૂત મિત્રને આદરપૂર્વક સંબોધન કરો.',
    hi: 'महत्वपूर्ण: हमेशा सरल और व्यावहारिक हिंदी में उत्तर दें। किसान भाई को सम्मानपूर्वक संबोधित करें।',
    en: 'Important: Answer in clear, polite, and simple English tailored for farmers and traders.'
  };

  const directive = langDirectives[language] || langDirectives.en;

  return `You are "Kisan AI Sahayak" (કિસાન એઆઈ સહાયક), an intelligent agricultural and APMC mandi market advisor for Indian and Gujarat farmers on the KishanSetu platform.
Your expertise includes:
1. APMC Mandi rates across Gujarat (Rajkot, Gondal, Ahmedabad, Surat, Unjha, Dahod, Amreli, Junagadh) and India.
2. Market trends, price forecasts, whether to sell now or hold produce.
3. Crop health, disease diagnostics, organic & conventional pest control, irrigation guidance, and fertilizer advisory.
4. Weather-related farming decisions and seasonal harvest tips.

Style Guidelines:
- ${directive}
- Keep answers concise, clear, and scannable (farmers read this quickly on mobile).
- Use bullet points, bold highlights for rates/figures, and agricultural emojis (🌾, 🚜, 💰, 💡, 📈).
- Be supportive, warm, and encourage fair trade and direct farmer empowerment.`;
};

/**
 * Ask Kisan AI Sahayak using Google Gemini API
 * @param {string} userQuery - The question asked by the farmer
 * @param {string} language - 'gu', 'hi', or 'en'
 * @param {Array} chatHistory - Optional previous messages for conversational context
 * @returns {Promise<string|null>} - Formatted response text or null if failed
 */
export const askKisanGeminiAI = async (userQuery, language = 'gu', chatHistory = []) => {
  if (!userQuery || !userQuery.trim()) return null;

  // Build context payload
  const systemInstructionText = getSystemInstruction(language);

  // Format conversation history for Gemini (last 4 messages for context)
  const recentHistory = chatHistory
    .slice(-4)
    .filter(msg => msg.text && msg.sender)
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

  // Append current question
  const contents = [
    ...recentHistory,
    {
      role: 'user',
      parts: [{ text: userQuery.trim() }]
    }
  ];

  const payload = {
    systemInstruction: {
      parts: [{ text: systemInstructionText }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 1000
    }
  };

  // Try models in cascade (fast flash-lite first, then flash)
  for (const model of GEMINI_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn(`[Kisan AI] Model ${model} returned status ${response.status}. Trying next...`);
        continue;
      }

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText && generatedText.trim()) {
        return generatedText.trim();
      }
    } catch (err) {
      console.warn(`[Kisan AI] Error calling ${model}:`, err.message);
    }
  }

  return null;
};
