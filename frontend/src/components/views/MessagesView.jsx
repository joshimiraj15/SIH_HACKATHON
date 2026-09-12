// src/components/views/MessagesView.jsx
import React, { useState } from 'react';
import { Send, User, MessageSquare, CheckCheck } from 'lucide-react';
import '../../styles/WhereShouldISell.css';

const MessagesView = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'AgroFresh Foods (Manager)', text: 'Namaste Meet bhai, we are ready to purchase 500kg Sharbati wheat at ₹24.5/kg. Pickup team is ready.', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'You', text: 'Namaste! Yes, the stock is bagged and ready at our Kuvadva warehouse.', time: '10:45 AM', isMe: true },
    { id: 3, sender: 'AgroFresh Foods (Manager)', text: 'Excellent. Our driver Rajesh will arrive tomorrow at 9:00 AM. Advance payment of 30% will be transferred shortly.', time: '11:00 AM', isMe: false }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'You',
        text: inputVal,
        time: 'Just now',
        isMe: true
      }
    ]);
    setInputVal('');
  };

  return (
    <div className="where-to-sell-container">
      <div className="where-header">
        <h1>Messages & Buyer Chat</h1>
        <p>Direct real-time negotiations with verified buyers and Mandi agents.</p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5ede7', overflow: 'hidden', display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '480px' }}>
        {/* Left conversations */}
        <div style={{ borderRight: '1px solid #e5ede7', background: '#f8faf8', padding: '12px' }}>
          <div style={{ padding: '10px 12px', background: '#ffffff', borderRadius: '10px', border: '1.5px solid #22c55e', marginBottom: '8px', cursor: 'pointer' }}>
            <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#14281d' }}>AgroFresh Foods</div>
            <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: '600' }}>Potato & Wheat Deal</div>
          </div>
          <div style={{ padding: '10px 12px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e5ede7', opacity: '0.7', cursor: 'pointer' }}>
            <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#14281d' }}>GreenLeaf Exports</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Tomato Quotation</div>
          </div>
        </div>

        {/* Right chat panel */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f1', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>AF</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>AgroFresh Foods (Manager)</div>
              <div style={{ fontSize: '0.72rem', color: '#16a34a' }}>● Online • Verified Buyer</div>
            </div>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            {messages.map((m) => (
              <div 
                key={m.id} 
                style={{
                  alignSelf: m.isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  background: m.isMe ? '#15803d' : '#f1f5f9',
                  color: m.isMe ? '#ffffff' : '#1f2937',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.86rem',
                  lineHeight: '1.4'
                }}
              >
                <div>{m.text}</div>
                <div style={{ fontSize: '0.65rem', color: m.isMe ? '#dcfce7' : '#94a3b8', textAlign: 'right', marginTop: '4px' }}>
                  {m.time} {m.isMe && '✓✓'}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ padding: '14px 20px', borderTop: '1px solid #f0f4f1', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Type message to buyer..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="form-control"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Send size={15} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
