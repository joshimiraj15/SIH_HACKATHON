// src/components/chat/AIChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Globe, 
  RotateCcw,
  Sprout,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume,
  ChevronDown
} from 'lucide-react';
import { translations } from '../../data/translations';
import { askKisanGeminiAI } from '../../services/geminiService';
import '../../styles/AIChatbot.css';

const AIChatbot = ({ language, setLanguage, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [isAutoVoiceOn, setIsAutoVoiceOn] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const recognitionRef = useRef(null);

  const t = translations[language] || translations.en;

  const languageOptions = [
    { code: 'en', label: 'English', sub: 'EN', voiceCode: 'en-IN' },
    { code: 'gu', label: 'ગુજરાતી', sub: 'GU', voiceCode: 'gu-IN' },
    { code: 'hi', label: 'हिंदी', sub: 'HI', voiceCode: 'hi-IN' },
    { code: 'mr', label: 'मराठी', sub: 'MR', voiceCode: 'mr-IN' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', sub: 'PA', voiceCode: 'pa-IN' },
    { code: 'ta', label: 'தமிழ்', sub: 'TA', voiceCode: 'ta-IN' },
    { code: 'te', label: 'తెలుగు', sub: 'TE', voiceCode: 'te-IN' },
    { code: 'kn', label: 'ಕನ್ನಡ', sub: 'KN', voiceCode: 'kn-IN' }
  ];

  const currentLangObj = languageOptions.find(l => l.code === language) || languageOptions[0];

  const initialGreeting = {
    en: "Namaste! I am your Kisan AI Sahayak powered by Google Gemini. Ask me about live mandi prices for Wheat, Tomato, Onion, Cotton or selling advice across APMC yards.",
    gu: "નમસ્તે! હું ગૂગલ જેમિની સંચાલિત તમારો કિસાન એઆઈ સહાયક છું. મને ઘઉં, ટામેટા, ડુંગળી, કપાસ કે મગફળીના આજના યાર્ડ ભાવો અથવા વેચાણ સલાહ વિશે પૂછો.",
    hi: "नमस्ते! मैं गूगल जेमिनी द्वारा संचालित आपका किसान एआई सहायक हूँ। मुझसे गेहूं, टमाटर, प्याज, कपास या मूंगफली के आज के मंडी भाव या बेचने की सलाह पूछें।",
    mr: "नमस्कार! मी तुमचा किसान AI सहाय्यक आहे. मला गहू, टोमॅटो, कांदा किंवा कापसाच्या आजच्या बाजारभावाबद्दल विचारा.",
    pa: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਕਿਸਾਨ AI ਸਹਾਇਕ ਹਾਂ। ਮੈਨੂੰ ਕਣਕ, ਟਮਾਟਰ, ਪਿਆਜ਼ ਜਾਂ ਕਪਾਹ ਦੇ ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ।",
    ta: "வணக்கம்! நான் உங்கள் கிசான் AI உதவியாளர். கோதுமை, தக்காளி, வெங்காயம் அல்லது பருத்தியின் இன்றைய சந்தை விலைகளை என்னிடம் கேளுங்கள்.",
    te: "నమస్కారం! నేను మీ కిసాన్ AI సహాయకుడిని. గోధుమ, టమోటా, ఉల్లిపాయ లేదా పత్తి యొక్క నేటి మార్కెట్ ధరలను నన్ను అడగండి.",
    kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕಿಸಾನ್ AI ಸಹಾಯಕ. ಗೋಧಿ, ಟೊಮೆಟೊ, ಈರುಳ್ಳಿ ಅಥವಾ ಹತ್ತಿಯ ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ."
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: initialGreeting[language] || initialGreeting.en,
      source: 'gemini',
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Dynamically update initial greeting message when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [
          {
            ...prev[0],
            text: initialGreeting[language] || initialGreeting.en
          }
        ];
      }
      return prev;
    });
  }, [language]);

  const langVoiceCodeMap = {
    en: 'en-IN',
    gu: 'gu-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    pa: 'pa-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN'
  };

  // Speech-to-Text Input (Microphone Recording)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = langVoiceCodeMap[language] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition start failed:", err);
      setIsListening(false);
    }
  };

  // Text-to-Speech Output (Voice Readout)
  const speakMessage = (text, msgId = null) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (window.speechSynthesis.speaking && speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean formatting markers before reading
    const cleanText = text.replace(/\*\*/g, '').replace(/[🌾💡🤖✨●👋💧💨🌡️]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langVoiceCodeMap[language] || 'en-IN';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const targetLangPrefix = language || 'en';
    const matchedVoice = voices.find(v => v.lang.toLowerCase().includes(targetLangPrefix));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onstart = () => {
      if (msgId) setSpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Quick suggestion questions in 8 languages
  const quickQuestions = {
    en: [
      "Wheat price in Rajkot APMC?",
      "Tomato live price & best mandi?",
      "Cotton & Groundnut rates in Gujarat?",
      "Should I sell now or wait 2 days?"
    ],
    gu: [
      "રાજકોટ યાર્ડમાં ઘઉંનો આજનો ભાવ શું છે?",
      "ટામેટાનો આજનો લાઈવ ભાવ અને શ્રેષ્ઠ યાર્ડ?",
      "ગુજરાતમાં કપાસ અને મગફળીનો ભાવ?",
      "માલ અત્યારે વેચવો કે 2 દિવસ રાહ જોવી?"
    ],
    hi: [
      "राजकोट मंडी में गेहूं का आज का रेट क्या है?",
      "टमाटर का ताजा भाव और सर्वोत्तम मंडी?",
      "गुजरात में कपास और मूंगफली का भाव?",
      "फसल अभी बेचें या 2 दिन रुकें?"
    ],
    mr: [
      "बाजारात गव्हाचा आजचा भाव काय आहे?",
      "टोमॅटोचा ताजा भाव आणि सर्वोत्तम मंडी?",
      "कापूस आणि भुईमुगाचा आजचा दर?",
      "माल आता विकावा की २ दिवस थांबावे?"
    ],
    pa: [
      "ਮੰਡੀ ਵਿੱਚ ਕਣਕ ਦਾ ਅੱਜ ਦਾ ਭਾਅ ਕੀ ਹੈ?",
      "ਟਮਾਟਰ ਦਾ ਤਾਜ਼ਾ ਰੇਟ ਅਤੇ ਸਭ ਤੋਂ ਵਧੀਆ ਮੰਡੀ?",
      "ਕਪਾਹ ਅਤੇ ਮੂੰਗਫਲੀ ਦੇ ਅੱਜ ਦੇ ਰੇਟ?",
      "ਫ਼ਸਲ ਹੁਣੇ ਵੇਚੀਏ ਜਾਂ 2 ਦਿਨ ਉਡੀਕ ਕਰੀਏ?"
    ],
    ta: [
      "சந்தையில் கோதுமையின் இன்றைய விலை என்ன?",
      "தக்காளியின் நேரலை விலை மற்றும் சிறந்த சந்தை?",
      "பருத்தி மற்றும் நிலக்கடலை தற்போதைய விலைகள்?",
      "இப்போது விற்க வேண்டுமா அல்லது 2 நாட்கள் காத்திருக்க வேண்டுமா?"
    ],
    te: [
      "మార్కెట్‌లో గోధుమల నేటి ధర ఎంత?",
      "టమోటా ప్రత్యక్ష ధర మరియు ఉత్తమ మార్కెట్?",
      "పత్తి మరియు వేరుశనగ ప్రస్తుత ధరలు?",
      "ఇప్పుడే అమ్మాలా లేక 2 రోజులు ఆగాలా?"
    ],
    kn: [
      "ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಗೋಧಿಯ ಇಂದಿನ ದರ ಎಷ್ಟು?",
      "ಟೊಮೆಟೊ ಲೈವ್ ದರ ಮತ್ತು ಅತ್ಯುತ್ತಮ ಮಾರುಕಟ್ಟೆ?",
      "ಹತ್ತಿ ಮತ್ತು ಕಡಲೆಕಾಯಿ ಇಂದಿನ ದರಗಳು?",
      "ಈಗಲೇ ಮಾರಾಟ ಮಾಡಬೇಕೇ ಅಥವಾ 2 ದಿನ ಕಾಯಬೇಕೇ?"
    ]
  };

  const currentQuestions = quickQuestions[language] || quickQuestions.en;

  // Local fallback price engine supporting 8 languages
  const getLocalCropResponse = (query, lang) => {
    const q = query.toLowerCase();
    let crop = 'Wheat';
    let rate = 2610;
    let trend = '+8.4%';
    let outlook = 'Bullish';

    if (q.includes('tomato') || q.includes('ટામેટા') || q.includes('ટમેટા') || q.includes('टमाटर') || q.includes('टोमॅटो') || q.includes('தக்காளி') || q.includes('టమోటా') || q.includes('ಟೊಮೆಟೊ')) {
      crop = 'Tomato';
      rate = 2650;
      trend = '+8.2%';
      outlook = 'High Demand';
    } else if (q.includes('onion') || q.includes('ડુંગળી') || q.includes('प्याज') || q.includes('कांदा') || q.includes('வெங்காயம்') || q.includes('ఉల్లిപాయ') || q.includes('ಈರುಳ್ಳಿ')) {
      crop = 'Onion';
      rate = 2420;
      trend = '-4.1%';
      outlook = 'Hold for next week';
    } else if (q.includes('potato') || q.includes('બટાકા') || q.includes('आलू') || q.includes('बटाटे') || q.includes('உருளைக்கிழங்கு') || q.includes('బంగాళాదుంప') || q.includes('ಆಲೂಗಡ್ಡೆ')) {
      crop = 'Potato';
      rate = 2310;
      trend = '+3.7%';
      outlook = 'Steady Demand';
    } else if (q.includes('cotton') || q.includes('કપાસ') || q.includes('कपास') || q.includes('कापूस') || q.includes('பருத்தி') || q.includes('పత్తి') || q.includes('ಹತ್ತಿ')) {
      crop = 'Cotton';
      rate = 6850;
      trend = '+4.2%';
      outlook = 'Export Demand High';
    } else if (q.includes('groundnut') || q.includes('મગફળી') || q.includes('मूंगफली') || q.includes('भुईमूग') || q.includes('நிலக்கடலை') || q.includes('వేరుశనగ') || q.includes('ಕಡಲೆಕಾಯಿ')) {
      crop = 'Groundnut';
      rate = 6200;
      trend = '+5.1%';
      outlook = 'Oil Mills Buying';
    }

    if (lang === 'gu') {
      return `🌾 **${crop} નો આજનો લાઈવ બજાર ભાવ:**\n\n• **રાજકોટ યાર્ડ (શ્રેષ્ઠ ભાવ):** ₹${rate} / ક્વિન્ટલ (${trend})\n• **અમદાવાદ APMC:** ₹${rate - 80} / ક્વિન્ટલ\n• **સુરત APMC:** ₹${rate - 320} / ક્વિન્ટલ\n\n💡 **કિસાન સલાહ:** બજાર આઉટલુક **${outlook}** છે. કિસાનસેતુ ડાયરેક્ટ બાયર્સને વેચવાથી તમને ટ્રાન્સપોર્ટ બચત સાથે વધુ નફો થશે!`;
    } else if (lang === 'hi') {
      return `🌾 **${crop} का आज का ताजा मंडी भाव:**\n\n• **राजकोट मंडी (सर्वोत्तम रेट):** ₹${rate} / क्विंटल (${trend})\n• **अहमदाबाद APMC:** ₹${rate - 80} / क्विंटल\n• **सूरत APMC:** ₹${rate - 320} / क्विंटल\n\n💡 **किसान सलाह:** बाजार का रुख **${outlook}** है। किसानसेतु डायरेक्ट बॉयर्स को बेचकर आप बिना आढ़त अधिक मुनाफा कमा सकते हैं!`;
    } else if (lang === 'mr') {
      return `🌾 **${crop} चा आजचा ताजी बाजार भाव:**\n\n• **मुख्य मंडी (सर्वोत्तम दर):** ₹${rate} / क्विंटल (${trend})\n• **APMC बाजार १:** ₹${rate - 80} / क्विंटल\n• **APMC बाजार २:** ₹${rate - 320} / क्विंटल\n\n💡 **शेतकरी सल्ला:** बाजाराचा कल **${outlook}** आहे. थेट खरेदीदारांना विक्री करून जास्तीत जास्त नफा मिळवा!`;
    } else if (lang === 'pa') {
      return `🌾 **${crop} ਦਾ ਅੱਜ ਦਾ ਤਾਜ਼ਾ ਮੰਡੀ ਭਾਅ:**\n\n• **ਮੁੱਖ ਮੰਡੀ (ਸਭ ਤੋਂ ਵਧੀਆ ਰੇਟ):** ₹${rate} / ਕੁਇੰਟਲ (${trend})\n• **APMC ਮੰਡੀ 1:** ₹${rate - 80} / ਕੁਇੰਟਲ\n• **APMC ਮੰਡੀ 2:** ₹${rate - 320} / ਕੁਇੰਟਲ\n\n💡 **ਕਿਸਾਨ ਸਲਾਹ:** ਬਾਜ਼ਾਰ ਦਾ ਰੁਝਾਨ **${outlook}** ਹੈ। ਕਿਸਾਨਸੇਤੂ 'ਤੇ ਸਿੱਧੇ ਖਰੀਦਦਾਰਾਂ ਨੂੰ ਵੇਚ ਕੇ ਵੱਧ ਮੁਨਾਫਾ ਕਮਾਓ!`;
    } else if (lang === 'ta') {
      return `🌾 **${crop} இன் இன்றைய சந்தை விலை:**\n\n• **முதன்மை சந்தை (சிறந்த விலை):** ₹${rate} / குவிண்டால் (${trend})\n• **APMC சந்தை 1:** ₹${rate - 80} / குவிண்டால்\n• **APMC சந்தை 2:** ₹${rate - 320} / குவிண்டால்\n\n💡 **விவசாயி ஆலோசனை:** சந்தை போக்கு **${outlook}** ஆக உள்ளது. கிசான்சேது மூலம் நேரடியாக விற்கவும்!`;
    } else if (lang === 'te') {
      return `🌾 **${crop} యొక్క నేటి మార్కెట్ ధర:**\n\n• **ప్రధాన మార్కెట్ (ఉత్తమ ధర):** ₹${rate} / క్వింటాల్ (${trend})\n• **APMC మార్కెట్ 1:** ₹${rate - 80} / క్వింటాల్\n• **APMC మార్కెట్ 2:** ₹${rate - 320} / క్వింటాల్\n\n💡 **రైతు సలహా:** మార్కెట్ ధోరణి **${outlook}** గా ఉంది. కిసాన్‌సేతు ద్వారా నేరుగా విక్రయించి అధిక లాభం పొందండి!`;
    } else if (lang === 'kn') {
      return `🌾 **${crop} ನ ಇಂದಿನ ಲೈವ್ ಮಾರುಕಟ್ಟೆ ದರ:**\n\n• **ಮುಖ್ಯ ಮಾರುಕಟ್ಟೆ (ಉತ್ತಮ ದರ):** ₹${rate} / ಕ್ವಿಂಟಾಲ್ (${trend})\n• **APMC ಮಾರುಕಟ್ಟೆ 1:** ₹${rate - 80} / ಕ್ವಿಂಟಾಲ್\n• **APMC ಮಾರುಕಟ್ಟೆ 2:** ₹${rate - 320} / ಕ್ವಿಂಟಾಲ್\n\n💡 **ರೈತ ಸಲಹೆ:** ಮಾರುಕಟ್ಟೆ ಮುನ್ಸೂಚನೆ **${outlook}** ಆಗಿದೆ. ಕಿಸಾನ್‌ಸೇತು ಮೂಲಕ ನೇರವಾಗಿ ಮಾರಾಟ ಮಾಡಿ!`;
    } else {
      return `🌾 **Current Live Market Rate for ${crop}:**\n\n• **Rajkot APMC (Top Rate):** ₹${rate} / Quintal (${trend})\n• **Ahmedabad APMC:** ₹${rate - 80} / Quintal\n• **Surat APMC:** ₹${rate - 320} / Quintal\n\n💡 **Advisory:** Market sentiment is **${outlook}**. You can lock direct farmgate pickup with zero commission on KisanSetu!`;
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const geminiReply = await askKisanGeminiAI(text, language, messages);
      const replyText = (geminiReply && geminiReply.trim()) ? geminiReply.trim() : getLocalCropResponse(text, language);
      const botMsgId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: replyText,
          source: geminiReply ? 'gemini' : 'local',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (isAutoVoiceOn) {
        speakMessage(replyText, botMsgId);
      }
    } catch (err) {
      console.warn("Kisan AI Assistant error:", err);
      const fallbackText = getLocalCropResponse(text, language);
      const botMsgId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: fallbackText,
          source: 'local',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (isAutoVoiceOn) {
        speakMessage(fallbackText, botMsgId);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: initialGreeting[language] || initialGreeting.en,
        source: 'gemini',
        time: 'Just now'
      }
    ]);
  };

  // Helper to render markdown bolding cleanly
  const renderFormattedText = (rawText) => {
    if (!rawText) return '';
    const parts = rawText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="ai-chatbot-launcher">
        <button 
          className="ai-launcher-btn"
          onClick={() => setIsOpen(!isOpen)}
          title="Kisan AI Sahayak - Voice & Mandi Assistant"
        >
          <div className="ai-icon-pulse">
            <Sparkles size={16} />
          </div>
          <span>{isOpen ? (language === 'gu' ? 'બંધ કરો' : language === 'hi' ? 'बंद करें' : 'Close AI') : t.aiAssistant}</span>
        </button>
      </div>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Chat Header */}
          <div className="ai-chat-header">
            <div className="ai-header-left">
              <div className="ai-avatar-header">
                🤖
              </div>
              <div className="ai-header-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3>{t.aiAssistant}</h3>
                  <span className="gemini-pill-badge">🎙️ Voice AI</span>
                </div>
                <p>● Live Voice & Mandi Advisor</p>
              </div>
            </div>

            <div className="ai-header-actions">
              {/* Auto Voice Readout Toggle */}
              <button 
                type="button"
                className={`ai-tool-btn ${isAutoVoiceOn ? 'voice-active' : ''}`}
                onClick={() => {
                  setIsAutoVoiceOn(!isAutoVoiceOn);
                  if (window.speechSynthesis && window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                  }
                }}
                title={isAutoVoiceOn ? "Auto Voice Readout On" : "Enable Auto Voice Readout"}
              >
                {isAutoVoiceOn ? <Volume2 size={14} className="text-amber-300" /> : <VolumeX size={14} />}
              </button>

              {/* Reset Chat */}
              <button 
                type="button"
                className="ai-tool-btn" 
                onClick={handleResetChat}
                title="Clear Chat / નવો વાર્તાલાપ"
              >
                <RotateCcw size={13} />
              </button>

              {/* Language Switcher Dropdown inside Chat */}
              <div className="ai-lang-dropdown-wrapper">
                <button 
                  type="button"
                  className="ai-lang-toggle-btn"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  title="Select AI Chat Language / ભાષા પસંદ કરો"
                >
                  <Globe size={12} />
                  <span>{currentLangObj.sub}</span>
                  <ChevronDown size={11} />
                </button>

                {showLangMenu && (
                  <div className="ai-chat-lang-popup">
                    <div className="ai-lang-popup-title">Select Language / ભાષા પસંદ કરો</div>
                    <div className="ai-lang-popup-grid">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          className={`ai-lang-option-btn ${language === lang.code ? 'active' : ''}`}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangMenu(false);
                          }}
                        >
                          <span className="lang-opt-name">{lang.label}</span>
                          <span className="lang-opt-code">({lang.sub})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button type="button" className="ai-close-btn" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Query Pills */}
          <div className="ai-quick-chips-bar">
            {currentQuestions.map((q, idx) => (
              <button 
                key={idx} 
                className="ai-chip-pill"
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="ai-messages-scroll">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble ${m.sender}`}>
                <div className="chat-bubble-content">
                  {renderFormattedText(m.text)}
                </div>
                <div className="bubble-meta">
                  {m.sender === 'bot' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="source-tag">
                        {m.source === 'gemini' ? '✨ Gemini AI' : '🌾 APMC Engine'}
                      </span>

                      {/* Text to Speech Button for Bot Messages */}
                      <button
                        type="button"
                        className={`speak-msg-btn ${speakingMsgId === m.id ? 'speaking' : ''}`}
                        onClick={() => speakMessage(m.text, m.id)}
                        title="Listen to response / અવાજ સાંભળો"
                      >
                        {speakingMsgId === m.id ? <Volume2 size={13} className="pulse-speaker" /> : <Volume size={13} />}
                      </button>
                    </div>
                  )}
                  <span className="bubble-time">{m.time}</span>
                </div>
              </div>
            ))}

            {isListening && (
              <div className="chat-listening-banner">
                <div className="listening-pulse-mic">
                  <Mic size={14} />
                </div>
                <span>
                  {language === 'gu' ? 'સાંભળી રહ્યું છે... હવે બોલો' : language === 'hi' ? 'सुन रहा है... अब बोलें' : 'Listening... Speak now'}
                </span>
              </div>
            )}

            {isTyping && (
              <div className="chat-bubble bot" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#355E3B', fontStyle: 'italic', fontSize: '0.8rem' }}>
                <Sparkles size={14} className="spin" /> 
                {language === 'gu' ? 'કિસાન એઆઈ જેમિની વિચારી રહ્યું છે...' : language === 'hi' ? 'किसान एआई जेमिनी विश्लेषण कर रहा है...' : 'Gemini AI Voice Assistant is analyzing...'}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer with Microphone & Send */}
          <form 
            className="ai-input-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            {/* Microphone Button for Speech Recognition */}
            <button 
              type="button"
              className={`ai-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceInput}
              title={isListening ? "Stop Listening" : "Speak to Ask / બોલીને પૂછો"}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input 
              type="text" 
              placeholder={isListening ? (language === 'gu' ? "સાંભળી રહ્યું છે..." : language === 'hi' ? "सुन रहा है..." : "Listening...") : t.typeQuestion} 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="ai-text-input"
              disabled={isTyping}
            />

            <button type="submit" className="ai-send-btn" disabled={!inputMessage.trim() || isTyping}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
