// src/components/views/MessagesView.jsx
import React, { useState, useEffect } from 'react';
import { Send, User, MessageSquare, CheckCheck, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/MessagesView.css';

const MessagesView = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(true);

  const role = currentUser?.role || 'farmer';

  const defaultPartners = [
    {
      _id: 'buyer-priya',
      name: 'Priya Sharma',
      businessName: 'Reliance Fresh Procurement',
      role: 'buyer',
      lastMessage: 'Namaste! We are inspecting the 40 quintal Sharbati wheat batch.',
    },
    {
      _id: 'buyer-vikram',
      name: 'Vikram Mehta',
      businessName: 'AgroCorp Global Exports',
      role: 'buyer',
      lastMessage: 'Can you deliver 30 quintals Shankar-6 cotton by Thursday?',
    },
    {
      _id: 'farmer-ramesh',
      name: 'Ramesh Patel',
      businessName: 'Patel Organic Farms',
      role: 'farmer',
      lastMessage: 'Yes, our moisture level is 10.8%, ready for pickup.',
    },
  ];

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.chat.getConversations().catch(() => ({ data: [] }));
      const list = res?.data?.length > 0 ? res.data.map(c => c.user) : defaultPartners.filter(p => p.role !== role);
      setConversations(list);
      if (list.length > 0 && !activePartner) {
        setActivePartner(list[0]);
      }
    } catch (err) {
      console.error('Failed to load chat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    if (activePartner) {
      loadMessages(activePartner._id);
    }
  }, [activePartner]);

  const loadMessages = async (partnerId) => {
    try {
      const res = await api.chat.getMessagesWithUser(partnerId).catch(() => ({ data: [] }));
      if (res?.data && res.data.length > 0) {
        setMessages(res.data);
      } else {
        setMessages([
          {
            _id: '1',
            sender: { _id: partnerId, name: activePartner?.name },
            text: `Namaste! Regarding your agricultural listing on KisanSetu. We are interested in confirming deal terms.`,
            createdAt: new Date(Date.now() - 3600000),
          },
          {
            _id: '2',
            sender: { _id: currentUser?._id || 'me', name: currentUser?.name || 'Me' },
            text: `Namaste! Yes, the produce is high grade with verified moisture standards. Ready for dispatch.`,
            createdAt: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !activePartner) return;

    const newText = inputVal;
    setInputVal('');

    // Optimistic append
    const tempMsg = {
      _id: Date.now().toString(),
      sender: { _id: currentUser?._id || 'me', name: currentUser?.name || 'Me' },
      text: newText,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await api.chat.sendMessage({
        receiverId: activePartner._id,
        text: newText,
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const quickReplies = [
    'Can you provide a certificate of quality?',
    'What is your final price per quintal?',
    'Our logistics truck is ready for pickup.',
    'Please accept the offer on KisanSetu.',
  ];

  return (
    <div className="messages-view-container">
      <div className="view-header-strip">
        <div>
          <h2>Direct Marketplace Chat & Deal Negotiation</h2>
          <p>Secure peer-to-peer communication between farmers and verified buyers</p>
        </div>
      </div>

      <div className="chat-layout-card">
        {/* Left Contacts List */}
        <div className="chat-contacts-sidebar">
          <div className="contacts-header">
            <span>Active Conversations</span>
          </div>

          <div className="contacts-list">
            {conversations.map((c) => {
              const isActive = activePartner?._id === c._id;
              return (
                <div
                  key={c._id}
                  className={`contact-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActivePartner(c)}
                >
                  <div className="contact-avatar">
                    {c.name ? c.name.charAt(0) : 'U'}
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">
                      <span>{c.name}</span>
                      <ShieldCheck size={13} className="text-emerald" />
                    </div>
                    <small className="contact-biz">{c.businessName || c.role}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Chat Area */}
        <div className="chat-active-window">
          {activePartner ? (
            <>
              <div className="chat-header-bar">
                <div className="chat-partner-avatar">
                  {activePartner.name.charAt(0)}
                </div>
                <div>
                  <div className="partner-name-line">
                    <strong>{activePartner.name}</strong>
                    <span className="online-pill">● Online</span>
                  </div>
                  <small className="partner-sub">{activePartner.businessName} • Verified Role: {activePartner.role}</small>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="chat-messages-area">
                {messages.map((m) => {
                  const isMe = m.sender?._id === (currentUser?._id || 'me') || m.sender?.name === 'Me';
                  return (
                    <div key={m._id} className={`chat-bubble-wrap ${isMe ? 'outgoing' : 'incoming'}`}>
                      <div className="chat-bubble">
                        <p>{m.text}</p>
                        <span className="chat-time">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && <CheckCheck size={12} className="text-emerald" />}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Negotiation Reply Chips */}
              <div className="quick-chips-row">
                {quickReplies.map((chip, i) => (
                  <button 
                    key={i} 
                    className="quick-chip-btn"
                    onClick={() => setInputVal(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="chat-input-row">
                <input
                  type="text"
                  placeholder="Type message to partner..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                />
                <button type="submit" className="btn-send-msg" disabled={!inputVal.trim()}>
                  <Send size={16} />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="empty-chat-prompt">
              <MessageSquare size={40} />
              <p>Select a contact to start negotiating deal terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
