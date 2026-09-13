// src/components/chat/AIChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  Globe,
  ArrowRight,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { chatAPI } from '../../services/api';
import { askKisanGeminiAI } from '../../services/geminiService';
import '../../styles/AIChatbot.css';


const AIChatbot = ({ language = 'gu', setLanguage, setActiveTab, isFullPage = false }) => {
  const [isOpen, setIsOpen] = useState(isFullPage);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language || 'gu');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'speaking'
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const initialGreetings = {
    gu: "નમસ્તે! હું કિસાન એઆઈ સહાયક છું 🌾\n\nઆજે ટામેટા, ડુંગળી કે ઘઉંના ભાવ અને બજાર વિશે શું જાણવું છે?",
    hi: "नमस्ते! मैं किसान एआई सहायक हूँ 🌾\n\nआज मंडी भाव, बाजार रुझान या बिक्री सलाह के बारे में पूछें।",
    en: "Hello! I am Kisan AI Sahayak 🌾\n\nAsk me about today's market rates, 3-day ML price predictions, or best selling mandis!"
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: initialGreetings[selectedLang] || initialGreetings.gu,
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap = {
        gu: 'gu-IN',
        hi: 'hi-IN',
        en: 'en-US'
      };
      recognition.lang = langMap[selectedLang] || 'gu-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('listening');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setVoiceStatus('processing');
        handleSendMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceStatus('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        if (voiceStatus === 'listening') {
          setVoiceStatus('idle');
        }
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  // Text-to-Speech Helper
  const speakText = (text) => {
    if (isMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any active speech

    const cleanText = text.replace(/[*#_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const voiceLangMap = {
      gu: 'gu-IN',
      hi: 'hi-IN',
      en: 'en-US'
    };
    utterance.lang = voiceLangMap[selectedLang] || 'gu-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus('speaking');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus('idle');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setVoiceStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setVoiceStatus('idle');
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setVoiceStatus('idle');
    } else {
      if (!recognitionRef.current) {
        alert('Voice speech recognition is not supported in this browser. Please use Google Chrome.');
        return;
      }
      try {
        stopSpeaking();
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Mic start error:', err);
      }
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
    setVoiceStatus('processing');

    try {
      let botAnswer = null;

      try {
        const res = await chatAPI.ask(text, selectedLang);
        if (res && res.success && res.source !== 'Offline RAG Fallback') {
          botAnswer = res.answer;
        }
      } catch (e) {
        console.warn('Backend chat API failed, calling direct Gemini API with key:', e.message);
      }

      if (!botAnswer) {
        const directGemini = await askKisanGeminiAI(text, selectedLang, messages);
        if (directGemini) {
          botAnswer = directGemini;
        }
      }

      if (!botAnswer) {
        botAnswer = selectedLang === 'gu'
          ? 'નમસ્તે! હું કિસાન એઆઈ સહાયક છું. આજના APMC માર્કેટ રેટ અને 3-દિવસીય ભાવ પ્રિડિક્શન જાણવા માર્કેટ લિસ્ટ જુઓ.'
          : selectedLang === 'hi'
          ? 'नमस्ते! मैं किसान एआई सहायक हूँ। आज के मंडी भाव और 3-दिवसीय पूर्वानुमान जानने के लिए मार्केट लिस्ट देखें।'
          : "Hello! I am Kisan AI Sahayak. Today's market rates are available in the Market Prices tab.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botAnswer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Automatically speak answer if not muted
      if (!isMuted) {
        speakText(botAnswer);
      } else {
        setVoiceStatus('idle');
      }
    } catch (err) {
      const fallbackMsg = selectedLang === 'gu'
        ? 'કિસાન એઆઈ માર્કેટ સપોર્ટ સેવા સક્રિય છે. તાજેતરના ભાવ જોવા માટે માર્કેટ પ્રાઈસ ટેબ ચકાસો.'
        : 'Kisan AI Market Advisory Service is active. Check Market Prices tab for live rates.';
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: fallbackMsg,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setVoiceStatus('idle');
    } finally {
      setIsTyping(false);
    }

  };

  const quickQuestions = [
    { gu: "આજે ટામેટાના ભાવ કેટલા છે?", hi: "आज टमाटर का भाव क्या है?", en: "Today's market price" },
    { gu: "મારા પાક માટે કયું માર્કેટ શ્રેષ્ઠ છે?", hi: "मेरी फसल के लिए कौन सी मंडी सबसे अच्छी है?", en: "Best market for my crop" },
    { gu: "ડુંગળીના ભાવનું પ્રિડિક્શન બતાવો", hi: "प्याज के मूल्य का पूर्वानुमान बताएं", en: "Predict my crop price" },
    { gu: "શું આજે પાક વેચવો જોઈએ?", hi: "क्या मुझे आज फसल बेचनी चाहिए?", en: "Should I sell today?" },
    { gu: "ખરીદદારો (Buyers) શોધો", hi: "खरीदार खोजें", en: "Find buyers" }
  ];

  const voiceStatusBadges = {
    idle: { label: '🎤 Tap to Speak', color: '#10b981', bg: '#ecfdf5' },
    listening: { label: '🔴 Listening...', color: '#ef4444', bg: '#fef2f2' },
    processing: { label: '📝 Processing AI...', color: '#f59e0b', bg: '#fffbeb' },
    speaking: { label: '🔊 AI Speaking Answer...', color: '#3b82f6', bg: '#eff6ff' }
  };

  const renderContent = () => (
    <div className={`krishi-assistant-wrapper ${isFullPage ? 'full-page' : 'widget-mode'}`}>
      {/* Voice Bar & Language Selector Header */}
      <div className="krishi-assistant-header" style={{ padding: '14px 18px', background: '#ffffff', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#fff', fontWeight: '800', fontSize: '1.2rem', textAlign: 'center', lineHeight: '40px' }}>
            🌾
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#17251c', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Kisan AI Voice Assistant
              <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '1px 7px', borderRadius: '99px', fontWeight: '700' }}>Live RAG</span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280' }}>Multilingual Voice AI & APMC Price Discovery</p>
          </div>
        </div>

        {/* Language Selector Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={14} color="#10b981" /> Language:
          </span>
          {['gu', 'hi', 'en'].map((langKey) => (
            <button
              key={langKey}
              type="button"
              className={`zen-cat-pill ${selectedLang === langKey ? 'active' : ''}`}
              onClick={() => {
                setSelectedLang(langKey);
                if (setLanguage) setLanguage(langKey);
              }}
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            >
              {langKey === 'gu' ? 'ગુજરાતી' : langKey === 'hi' ? 'हिन्दी' : 'English'}
            </button>
          ))}
          {!isFullPage && (
            <button className="krishi-tool-btn" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Voice Status Badge & Audio Controls */}
      <div style={{ padding: '10px 18px', background: voiceStatusBadges[voiceStatus].bg, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: '800', color: voiceStatusBadges[voiceStatus].color, display: 'flex', alignItems: 'center', gap: '6px' }}>
          {voiceStatusBadges[voiceStatus].label}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Square size={12} /> Stop
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted) stopSpeaking();
            }}
            style={{ background: isMuted ? '#fee2e2' : '#e0f2fe', color: isMuted ? '#ef4444' : '#0284c7', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {isMuted ? 'Muted' : 'Sound On'}
          </button>
        </div>
      </div>

      {/* Suggested Quick Questions Rail */}
      <div className="krishi-suggestions-rail" style={{ padding: '8px 18px', background: '#fafbfa', borderBottom: '1px solid #f3f4f6', overflowX: 'auto', display: 'flex', gap: '8px' }}>
        {quickQuestions.map((qObj, idx) => {
          const qText = qObj[selectedLang] || qObj.gu;
          return (
            <button
              key={idx}
              className="krishi-pill-chip"
              onClick={() => handleSendMessage(qText)}
              disabled={isTyping}
              style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}
            >
              {qText}
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Body */}
      <div className="krishi-messages-box" style={{ padding: '16px 18px', minHeight: isFullPage ? '380px' : '260px', maxHeight: isFullPage ? '500px' : '320px', overflowY: 'auto' }}>
        {messages.map((m) => (
          <div key={m.id} className={`krishi-bubble-row ${m.sender}`}>
            <div className="krishi-bubble">
              <div className="krishi-text-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                {m.text}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.72rem', opacity: 0.8 }}>
                <span>{m.time}</span>
                {m.sender === 'bot' && (
                  <button 
                    type="button" 
                    onClick={() => speakText(m.text)}
                    style={{ background: 'none', border: 'none', color: '#047857', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: '700' }}
                  >
                    <Volume2 size={12} /> Speak
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="krishi-bubble-row bot">
            <div className="krishi-typing-indicator">
              <Sparkles size={14} className="krishi-spin" />
              <span>Analyzing live Mandi database & ML models...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Large Microphone & Input Footer */}
      <div style={{ padding: '14px 18px', background: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Large Primary Mic Button (Section 10 Requirement) */}
          <button
            type="button"
            onClick={toggleMic}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: isListening ? '#ef4444' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: isListening ? '0 0 16px rgba(239, 68, 68, 0.6)' : '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            title={isListening ? 'Stop Listening' : 'Tap to Speak'}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          {/* Text Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ flex: 1, display: 'flex', gap: '8px' }}
          >
            <input 
              type="text"
              placeholder={
                isListening 
                  ? "Listening to speech..." 
                  : selectedLang === 'gu' ? "પ્રશ્ન પૂછો (જેમ કે: આજે ટામેટાના ભાવ કેટલા છે?)" : selectedLang === 'hi' ? "सवाल पूछें (जैसे: आज टमाटर का भाव क्या है?)" : "Ask a question..."
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="krishi-text-box"
              disabled={isTyping || isListening}
              style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #d1d5db', fontSize: '0.9rem' }}
            />

            <button 
              type="submit" 
              className="krishi-send-submit"
              disabled={!inputMessage.trim() || isTyping}
              style={{ padding: '0 18px', borderRadius: '10px', background: '#10b981', color: '#fff', border: 'none', fontWeight: '700' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  if (isFullPage) {
    return renderContent();
  }

  return (
    <>
      <div className="krishi-ai-floating-trigger">
        <button 
          className="krishi-ai-circle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Voice AI Assistant"
          title="Voice AI Assistant"
        >
          {isOpen ? (
            <X size={26} color="#ffffff" />
          ) : (
            <div className="krishi-circle-inner">
              <Mic size={26} color="#ffffff" />
              <span className="krishi-sparkle-dot">✨</span>
            </div>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="krishi-chat-modal" style={{ maxWidth: '480px', width: '92vw' }}>
          {renderContent()}
        </div>
      )}
    </>
  );
};

export default AIChatbot;
