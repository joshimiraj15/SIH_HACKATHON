// src/components/views/MessagesView.jsx
import React, { useState, useRef, useEffect } from 'react';
import { translations } from '../../data/translations';
import { 
  Send, 
  Search, 
  Paperclip, 
  CheckCheck, 
  Phone, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon,
  MoreVertical,
  Sprout
} from 'lucide-react';
import '../../styles/MessagesView.css';

const INITIAL_CONVERSATIONS = [
  {
    id: 'agrofresh',
    name: 'AgroFresh Foods (Pvt Ltd)',
    shortName: 'AF',
    color: '#15803d',
    crop: 'Tomato & Sharbati Wheat',
    online: true,
    unread: 1,
    time: '11:00 AM',
    messages: [
      { 
        id: 1, 
        sender: 'buyer', 
        text: 'Namaste Meet bhai, we inspected your 50 Quintal Sharbati wheat sample. Quality grade is A-1.', 
        time: '10:30 AM' 
      },
      { 
        id: 2, 
        sender: 'me', 
        text: 'Namaste! Yes, the grain moisture is strictly below 10.5%. We expect ₹2,650/Quintal for this lot.', 
        time: '10:45 AM' 
      },
      { 
        id: 3, 
        sender: 'buyer', 
        text: 'Agreed. Our procurement vehicle will arrive at your Kuvadva warehouse tomorrow morning at 9:00 AM. 30% advance will be credited via UPI once loaded.', 
        time: '11:00 AM',
        attachment: { type: 'doc', name: 'Purchase_Order_AF902.pdf', size: '240 KB' }
      }
    ]
  },
  {
    id: 'saurashtra-spin',
    name: 'Saurashtra Spin Mills Ltd',
    shortName: 'SS',
    color: '#047857',
    crop: 'Shankar-6 Cotton',
    online: true,
    unread: 0,
    time: 'Yesterday',
    messages: [
      { 
        id: 1, 
        sender: 'buyer', 
        text: 'Pranam! Are you holding 80 Quintals of Shankar-6 Cotton with staple length 29mm+?', 
        time: 'Yesterday, 3:15 PM' 
      },
      { 
        id: 2, 
        sender: 'me', 
        text: 'Yes sir, we harvested last week. Clean ginning grade. Offered price ₹7,100/Quintal farmgate.', 
        time: 'Yesterday, 4:20 PM' 
      },
      { 
        id: 3, 
        sender: 'buyer', 
        text: 'Can you share a test certificate or high-res bale photograph?', 
        time: 'Yesterday, 4:45 PM' 
      }
    ]
  },
  {
    id: 'gujarat-fpo',
    name: 'Gujarat Organic Farmers FPO',
    shortName: 'GF',
    color: '#10b981',
    crop: 'Groundnut GG-20',
    online: false,
    unread: 0,
    time: '2 days ago',
    messages: [
      { 
        id: 1, 
        sender: 'buyer', 
        text: 'We are procuring 100 quintals Groundnut GG-20 for organic cold-pressed oil extraction.', 
        time: '2 days ago' 
      },
      { 
        id: 2, 
        sender: 'me', 
        text: 'We have 45 bags ready. Oil content lab tested at 51.2%. Direct dispatch available.', 
        time: '2 days ago' 
      }
    ]
  },
  {
    id: 'reliance-agri',
    name: 'Reliance Fresh Agri Hub',
    shortName: 'RF',
    color: '#059669',
    crop: 'Potato & Red Onion',
    online: true,
    unread: 2,
    time: 'Just now',
    messages: [
      { 
        id: 1, 
        sender: 'buyer', 
        text: 'Hello Farmer, we require 40 bags of uniform size Red Onion for Rajkot distribution center.', 
        time: '9:15 AM' 
      },
      { 
        id: 2, 
        sender: 'buyer', 
        text: 'Offering ₹2,450/Quintal spot cash payment on unloading.', 
        time: 'Just now' 
      }
    ]
  }
];

const MessagesView = ({ language, showToast }) => {
  const t = translations[language] || translations.en;
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState('agrofresh');
  const [inputVal, setInputVal] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv.messages, isTyping]);

  const handleSelectConv = (id) => {
    setActiveId(id);
    setConversations(prev => prev.map(c => {
      if (c.id === id) return { ...c, unread: 0 };
      return c;
    }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          time: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    const sentText = inputVal;
    setInputVal('');

    // Simulate realistic buyer auto-reply after 1.5s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = `Thank you for confirming! We have logged this in our KisanSetu procurement system. Our logistics team will call you shortly.`;
      
      if (sentText.toLowerCase().includes('price') || sentText.toLowerCase().includes('rate') || sentText.toLowerCase().includes('₹')) {
        replyText = `Rate acknowledged. That aligns with today's APMC benchmark. We can execute the digital contract today.`;
      } else if (sentText.toLowerCase().includes('ready') || sentText.toLowerCase().includes('sample')) {
        replyText = `Understood. Our quality assessor is stationed in Rajkot yard and can visit your farm within 2 hours.`;
      }

      setConversations(prev => prev.map(c => {
        if (c.id === activeId) {
          return {
            ...c,
            time: 'Just now',
            messages: [
              ...c.messages,
              {
                id: Date.now() + 1,
                sender: 'buyer',
                text: replyText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]
          };
        }
        return c;
      }));
    }, 1400);
  };

  const handleAttachMockDoc = () => {
    const attachMsg = {
      id: Date.now(),
      sender: 'me',
      text: 'Sharing our government lab moisture test certificate & weight slip for this lot.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: { type: 'image', name: 'APMC_Quality_Report.pdf', size: '1.2 MB' }
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: [...c.messages, attachMsg]
        };
      }
      return c;
    }));
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="messages-page-container">
      {/* Header */}
      <div className="messages-header-row">
        <div className="messages-title-block">
          <h1>{t.directBuyerMarketplaceChat}</h1>
          <p>{t.marketplaceChatDesc}</p>
        </div>
        <div className="chat-badge-live">
          <div className="chat-badge-pulse" />
          <span>{t.liveMandiDeskActive}</span>
        </div>
      </div>

      {/* Split Pane Marketplace Chat */}
      <div className="marketplace-chat-card">
        {/* Left Pane: Conversation Threads */}
        <div className="chat-threads-sidebar">
          <div className="chat-threads-header">
            <h3>{t.buyerConversations}</h3>
            <div className="threads-search-wrap">
              <Search size={15} className="threads-search-icon" />
              <input 
                type="text"
                placeholder={t.searchBuyerCropPH || "Search buyer or crop..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="threads-search-input"
              />
            </div>
          </div>

          <div className="chat-threads-list">
            {filteredConversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isSelected = conv.id === activeId;

              return (
                <div 
                  key={conv.id}
                  className={`thread-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectConv(conv.id)}
                >
                  <div className="thread-avatar-wrap">
                    <div className="thread-avatar" style={{ background: conv.color }}>
                      {conv.shortName}
                    </div>
                    {conv.online && <div className="thread-online-dot" />}
                  </div>

                  <div className="thread-info">
                    <div className="thread-top">
                      <span className="thread-name">{conv.name}</span>
                      <span className="thread-time">{conv.time}</span>
                    </div>
                    <div className="thread-bottom">
                      <span className="thread-preview">
                        {lastMsg ? lastMsg.text : conv.crop}
                      </span>
                      {conv.unread > 0 && (
                        <span className="thread-unread-pill">{conv.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Chat Window */}
        <div className="active-chat-panel">
          {/* Header */}
          <div className="chat-panel-header">
            <div className="chat-header-buyer-info">
              <div className="chat-buyer-avatar" style={{ background: activeConv.color }}>
                {activeConv.shortName}
              </div>
              <div className="chat-buyer-details">
                <h4>
                  {activeConv.name}
                  <span className="chat-verified-badge">
                    <ShieldCheck size={13} /> Verified
                  </span>
                </h4>
                <div className="chat-status-text">
                  {activeConv.online ? t.onlineReadyToBuy : t.lastActive2h}
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <div className="chat-deal-chip">
                <Sprout size={14} />
                <span>{activeConv.crop}</span>
              </div>
              <button 
                className="chat-action-icon-btn" 
                title="Call Buyer"
                onClick={() => {
                  if (showToast) showToast(`📞 Dialing verified procurement desk of ${activeConv.name}: +91 1800-200-4560`);
                }}
              >
                <Phone size={16} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="chat-messages-container">
            <div className="chat-date-separator">
              {t.e2eEncryptedComm}
            </div>

            {activeConv.messages.map((m) => (
              <div key={m.id} className={`chat-message-row ${m.sender}`}>
                <div className="chat-bubble-box">
                  <div>{m.text}</div>
                  
                  {m.attachment && (
                    <div className="chat-attachment-card">
                      <FileText size={16} color="#10b981" />
                      <span>{m.attachment.name} ({m.attachment.size})</span>
                    </div>
                  )}
                </div>

                <div className="chat-bubble-meta">
                  <span>{m.time}</span>
                  {m.sender === 'me' && <CheckCheck size={14} color="#10b981" />}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="typing-indicator">
                <span>{activeConv.name} {t.isTypingTxt}</span>
                <div className="typing-dots">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="chat-input-bar">
            <button 
              type="button" 
              className="chat-attach-btn" 
              title="Attach Document or Lab Slip"
              onClick={handleAttachMockDoc}
            >
              <Paperclip size={18} />
            </button>
            
            <input 
              type="text" 
              placeholder={t.messageBuyerPH ? t.messageBuyerPH.replace("{buyerName}", activeConv.name) : `Message ${activeConv.name}...`}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="chat-text-input"
            />

            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={!inputVal.trim()}
            >
              <Send size={16} />
              <span>{t.sendBtn}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
