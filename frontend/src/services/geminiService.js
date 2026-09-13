// src/services/geminiService.js
// Kisan AI Sahayak - Google Gemini API Integration with Smart Fallback

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6LGuOcs5QBMpEejJSrFKZyjZiyxdnCuqfe2sv35cbp8Zg';

// Active & high-performance Gemini models
const GEMINI_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3.5-flash-lite'];

/**
 * System prompt tailored for Gujarat & Indian agriculture
 */
const getSystemInstruction = (language) => {
  const langDirectives = {
    gu: 'સૂચના: ખેડૂત સાથે સરળ, નમ્ર અને વ્યવહારુ ગુજરાતીમાં વાત કરો. પાકના ભાવ, રોગ-જીવાત, હવામાન અને વેચાણ માટે સચોટ માર્ગદર્શન આપો.',
    hi: 'निर्देश: किसान से सरल, विनम्र और व्यावहारिक हिंदी में बात करें। फसल के भाव, रोग-कीट, मौसम और बिक्री पर सटीक सलाह दें।',
    en: 'Important: Answer in clear, polite, and simple English tailored for farmers and traders.'
  };

  const directive = langDirectives[language] || langDirectives.en;

  return `You are "Kisan AI Sahayak" (કિસાન AI સહાયક), the farmer-friendly agricultural assistant for KisanSetu.
Your expertise includes:
1. Help with mandi prices, crop planning, weather impacts, crop health, pest/disease advice, irrigation, fertilizer guidance, and direct buyer selling.
2. Answer in Gujarati, Hindi, or English based on the user's language.
3. Keep responses short, practical, mobile-friendly, and respectful. Use bullet points, bold prices, and simple farming language.
4. Give direct recommendations and suggest whether to sell now or wait. In voice mode, speak briefly and clearly.
5. Provide helpful and actionable agricultural advice. Encourage fair pricing, direct market access, and farmer empowerment.

Style Guidelines:
- ${directive}`;
};

// -------------------------------------------------------------
// SMART LOCAL AI: Keyword-based fallback when offline
// -------------------------------------------------------------
const CROP_PRICES = {
  tomato:    { gu: 'ટામેટા', min: 800,  modal: 1200, max: 1800 },
  onion:     { gu: 'ડુંગળી', min: 600,  modal: 900,  max: 1400 },
  potato:    { gu: 'બટાટા',  min: 700,  modal: 1000, max: 1500 },
  wheat:     { gu: 'ઘઉં',    min: 2100, modal: 2300, max: 2500 },
  cotton:    { gu: 'કપાસ',   min: 6000, modal: 6500, max: 7500 },
  groundnut: { gu: 'મગફળી', min: 5000, modal: 5500, max: 6500 },
  soybean:   { gu: 'સોયાબીન',min: 3800, modal: 4200, max: 4800 },
  chilli:    { gu: 'મરચા',   min: 4000, modal: 5500, max: 8000 },
  garlic:    { gu: 'લસણ',   min: 3000, modal: 4000, max: 6000 },
  brinjal:   { gu: 'રીંગણ',  min: 400,  modal: 700,  max: 1200 },
  rice:      { gu: 'ડાંગર',  min: 1800, modal: 2100, max: 2400 },
};

const detectCrop = (text) => {
  const t = text.toLowerCase();
  const cropKeywords = {
    tomato: ['tomato', 'tameta', 'ટામેટા', 'ટમેટા'],
    onion: ['onion', 'dungari', 'dungli', 'pyaz', 'ડુંગળી', 'કાંદા'],
    potato: ['potato', 'bateta', 'batata', 'aloo', 'બટાટા', 'બટેટા', 'આલુ'],
    wheat: ['wheat', 'ghau', 'gehu', 'ઘઉં', 'ગેહૂ'],
    cotton: ['cotton', 'kapas', 'કપાસ', 'રૂ'],
    groundnut: ['groundnut', 'peanut', 'magfali', 'mungfali', 'મગફળી', 'માંડવી'],
    soybean: ['soybean', 'soya', 'soyanbin', 'સોયાબીન'],
    chilli: ['chilli', 'marcha', 'mirchi', 'મરચા', 'મિર્ચી'],
    garlic: ['garlic', 'lasan', 'lasun', 'lahsun', 'લસણ', 'લહસુન'],
    brinjal: ['brinjal', 'eggplant', 'ringna', 'baingan', 'રીંગણ', 'રીંગણા'],
    rice: ['rice', 'dang', 'dangar', 'chawal', 'ડાંગર', 'ચોખા'],
  };
  for (const [crop, keywords] of Object.entries(cropKeywords)) {
    if (keywords.some(kw => t.includes(kw))) return crop;
  }
  return null;
};

const smartFallbackResponse = (question, language) => {
  const q = question.toLowerCase();
  const crop = detectCrop(q);
  const cropData = crop ? CROP_PRICES[crop] : null;

  const isPriceQ = /bhav|price|ભાવ|દર|rate|kem|keti|mol|modal|mandi/.test(q);
  const isSellQ = /sell|vech|vekvu|bechan|વેચ|becho|should i|hovu joie|joie/.test(q);
  const isWeatherQ = /weather|hava|vayu|havaman|rain|varsha|barish|humid|હવામાન|વરસાદ/.test(q);
  const isPestQ = /pest|disease|rog|jiv jant|bug|kido|fungus|spray|દવા|રોગ|જીવાત|dawai/.test(q);
  const isFertQ = /fertilizer|khatar|urea|dap|ખાતર|fertiliser|manure/.test(q);
  const isBuyerQ = /buyer|kharido|kharedar|ખરીદ|vepar|vyapari|customer/.test(q);

  if (language === 'gu') {
    if (isPriceQ && cropData) {
      return `📊 **${cropData.gu} (${crop.charAt(0).toUpperCase() + crop.slice(1)}) ના આજના અંદાજિત APMC ભાવ:**\n\n` +
        `🔹 લઘુત્તમ ભાવ: ₹${cropData.min}/ક્વિન્ટલ\n` +
        `🔹 સરેરાશ ભાવ (Modal): ₹${cropData.modal}/ક્વિન્ટલ\n` +
        `🔹 મહત્તમ ભાવ: ₹${cropData.max}/ક્વિન્ટલ\n\n` +
        `💡 **સલાહ:** બજારમાં માલ લઈ જતા પહેલા સ્થાનિક APMC માર્કેટના ભાવ ચકાસી લો.\n` +
        `🌐 KisanSetu ના Market Prices ટેબમાં લાઇવ ભાવ જોઈ શકો છો.`;
    }
    if (isPriceQ) {
      return `📈 **આજના મુખ્ય APMC ભાવ (ગુજરાત):**\n\n🔹 ટામેટા: ₹800-₹1,800/ક્વિન્ટલ\n🔹 ડુંગળી: ₹600-₹1,400/ક્વિન્ટલ\n🔹 ઘઉં: ₹2,100-₹2,500/ક્વિન્ટલ\n🔹 કપાસ: ₹6,000-₹7,500/ક્વિન્ટલ\n\n📊 વધુ પાકના ભાવ માટે Market Prices ટેબ જુઓ.`;
    }
    if (isSellQ && cropData) {
      return `📊 **વેચાણ સલાહકાર - ${cropData.gu}:**\n\n✅ હાલ સરેરાશ ભાવ ₹${cropData.modal}/ક્વિન્ટલ ચાલે છે.\n📦 જો ગુણવત્તા સારી હોય તો 50% માલ અત્યારે વેચો અને બાકી 50% થોડા દિવસ સાચવી શકો છો.\n🌐 e-NAM કે KisanSetu Buyer Marketplace પર શ્રેષ્ઠ ઓફર મેળવો.`;
    }
    if (isSellQ) {
      return `📊 **વેચાણ સલાહકાર:**\n\n✅ વર્તમાન બજારભાવ સંતોષકારક હોય તો અડધો માલ વેચી શકાય.\n📦 ભાવ વધારાની સંભાવના હોય તો સારો માલ સાચવીને રાખો.\n🌐 સ્થાનિક APMC અને ઓનલાઇન ખરીદદારોના ભાવ સરખાવીને નિર્ણય લો.`;
    }
    if (isWeatherQ) {
      return `🌤️ **હવામાન અપડેટ (ગુજરાત):**\n\n🔹 તાપમાન: 30-36°C\n🔹 ભેજ: 60-75%\n\n🌧️ **ખેડૂત સલાહ:** વરસાદની સંભાવના હોય તો લણેલો પાક સુરક્ષિત ગોડાઉનમાં રાખો અને યોગ્ય ફૂગનાશક છંટકાવ કરો.`;
    }
    if (isPestQ) {
      return `🐛 **રોગ/જીવાત નિયંત્રણ માર્ગદર્શન:**\n\n🔹 **ટામેટા/બટાટા (સુકારો):** મેન્કોઝેબ ૦.૨% છંટકાવ કરો\n🔹 **કપાસ (ઇયળ):** કોરાજેન અથવા સ્પીનોસાડ ભલામણ મુજબ\n🔹 **ઘઉં (ગેરુ):** પ્રોપીકોનાઝોલ ૦.૧%\n\n⏰ દવા છંટકાવ વહેલી સવારે અથવા સાંજે ઠંડા વાતાવરણમાં કરો.`;
    }
    if (isFertQ) {
      return `🌱 **ખાતર માર્ગદર્શન:**\n\n🔹 જમીન ચકાસણી મુજબ જ રાસાયણિક ખાતરો વાપરો.\n🔹 પાયામાં ડીએપી અને પોટાશ તથા વૃદ્ધિ સમયે યુરિયાનો યોગ્ય માત્રામાં ઉપયોગ કરો.\n🔹 સૂક્ષ્મ પોષકતત્વો (ઝિંક, બોરોન) નો જરૂર મુજબ છંટકાવ કરો.`;
    }
    if (isBuyerQ) {
      return `🤝 **ખરીદદાર (Buyers) શોધવા માટે:**\n\n🔹 KisanSetu ના **Buyers** ટેબમાં જઈને ખરીદદારોની યાદી જુઓ.\n🔹 તમારા પાકની વિગત લિસ્ટ કરો જેથી ખરીદદારો સીધો સંપર્ક કરી શકે.\n🔹 e-NAM પોર્ટલ પર પણ રજીસ્ટ્રેશન કરી શકો છો.`;
    }

    return `🙏 **નમસ્તે! હું કિસાન AI સહાયક છું.**\n\nહું તમને નીચેની બાબતોમાં મદદ કરી શકું છું:\n🔹 APMC માર્કેટ યાર્ડના ભાવ\n🔹 પાક વેચવો કે સાચવવો તેની સલાહ\n🔹 હવામાન અપડેટ અને ખેતી કાર્યો\n🔹 પાક રોગ, જીવાત અને દવાઓ\n🔹 ખાતરનું યોગ્ય આયોજન\n\n💬 કૃપા કરીને તમારો પ્રશ્ન પૂછો!`;
  }

  // Hindi
  if (language === 'hi') {
    if (isPriceQ && cropData) {
      return `📊 **${crop.charAt(0).toUpperCase() + crop.slice(1)} के आज के अनुमानित भाव:**\n\n` +
        `🔹 न्यूनतम: ₹${cropData.min}/क्विंटल\n🔹 मॉडल रेट: ₹${cropData.modal}/क्विंटल\n🔹 अधिकतम: ₹${cropData.max}/क्विंटल\n\n` +
        `💡 **सुझाव:** मंडी ले जाने से पहले स्थानीय APMC से पुष्टि कर लें।`;
    }
    if (isPriceQ) {
      return `📈 **आज के मुख्य मंडी भाव:**\n\n🔹 टमाटर: ₹800-₹1,800/क्विंटल\n🔹 प्याज: ₹600-₹1,400/क्विंटल\n🔹 गेहूं: ₹2,100-₹2,500/क्विंटल\n🔹 कपास: ₹6,000-₹7,500/क्विंटल\n\n📊 अधिक जानकारी के लिए Market Prices टैब देखें।`;
    }
    if (isSellQ && cropData) {
      return `📊 **बिक्री सलाह - ${crop}:**\n\n✅ वर्तमान मॉडल रेट ₹${cropData.modal}/क्विंटल है।\n📦 40-50% माल अभी बेच सकते हैं, बाकी आगे के भाव देखकर निर्णय लें।`;
    }
    if (isWeatherQ) {
      return `🌤️ **मौसम परामर्श:**\n\nतापमान 30-36°C के आसपास रहेगा। फसल को वर्षा से सुरक्षित स्थान पर रखें।`;
    }
    if (isPestQ) {
      return `🐛 **कीट एवं रोग नियंत्रण:**\n\nरोग के लक्षण अनुसार कृषि विशेषज्ञ की सलाह से सही कीटनाशक या फफूंदनाशक का छिड़काव सुबह के समय करें।`;
    }
    return `🙏 **नमस्ते! मैं किसान AI सहायक हूँ।**\n\nआप मुझसे मंडी भाव, फसल बिक्री, मौसम या खाद-दवा के बारे में पूछ सकते हैं।`;
  }

  // English
  if (isPriceQ && cropData) {
    return `📊 **Today's APMC Price - ${crop.charAt(0).toUpperCase() + crop.slice(1)}:**\n\n` +
      `🔹 Min: ₹${cropData.min}/quintal\n🔹 Modal: ₹${cropData.modal}/quintal\n🔹 Max: ₹${cropData.max}/quintal\n\n` +
      `💡 Compare with your local APMC before selling.`;
  }
  if (isPriceQ) {
    return `📈 **Today's Key Market Prices (Gujarat APMC):**\n\n🔹 Tomato: ₹800-₹1,800/qt\n🔹 Onion: ₹600-₹1,400/qt\n🔹 Wheat: ₹2,100-₹2,500/qt\n🔹 Cotton: ₹6,000-₹7,500/qt\n\n📊 Check Market Prices tab for live data.`;
  }
  if (isSellQ && cropData) {
    return `📊 **Sell or Wait - ${crop}?**\n\n✅ Current modal price ₹${cropData.modal}/quintal is fair.\n📦 Consider selling 40-50% now and holding the rest if you anticipate higher demand.`;
  }
  if (isWeatherQ) {
    return `🌤️ **Weather Advisory:**\n\nTemp: 30-36°C. Monitor forecasts and ensure stored grains remain protected from humidity.`;
  }
  if (isPestQ) {
    return `🐛 **Pest & Disease Control:**\n\nApply recommended fungicides/pesticides early morning for optimal efficacy.`;
  }
  if (isFertQ) {
    return `🌱 **Fertilizer Guide:**\n\nUse balanced NPK and micronutrients per your soil health card recommendation.`;
  }
  if (isBuyerQ) {
    return `🤝 **Find Buyers:**\n\nUse KisanSetu Buyers Tab to connect directly with verified buyers, traders, and FPOs.`;
  }

  return `🙏 **Hello! I'm Kisan AI Sahayak**\n\nAsk me about APMC market prices, crop selling advice, weather updates, pest control, or fertilizers.`;
};

// --------------------------------------------------------------------------------------------------
// Main exported function: tries Gemini API, then smart fallback
// --------------------------------------------------------------------------------------------------
export const askKisanGeminiAI = async (userQuery, language = 'gu', chatHistory = []) => {
  if (!userQuery || !userQuery.trim()) return null;

  // Accept any valid non-empty API key (Google AI Studio, Cloud, Vertex, etc.)
  const isValidGeminiKey = Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim() && GEMINI_API_KEY.length > 10);

  if (isValidGeminiKey) {
    const systemInstructionText = getSystemInstruction(language);

    const recentHistory = chatHistory
      .slice(-4)
      .filter(msg => msg.text && msg.sender)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

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
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    };

    for (const model of GEMINI_MODELS) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
  }

  // Smart local fallback when offline or API limit reached
  console.info('[Kisan AI] Using Smart Fallback Engine');
  return smartFallbackResponse(userQuery, language);
};