import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import '../../styles/MarketTicker.css';

const tickerData = [
  { name: 'Wheat', price: '₹2,450', high: '₹2,500', low: '₹2,400', trend: 'up' },
  { name: 'Cotton', price: '₹7,120', high: '₹7,200', low: '₹7,000', trend: 'up' },
  { name: 'Onion', price: '₹2,180', high: '₹2,300', low: '₹2,100', trend: 'down' },
  { name: 'Tomato', price: '₹1,850', high: '₹1,900', low: '₹1,800', trend: 'down' },
  { name: 'Groundnut', price: '₹6,450', high: '₹6,600', low: '₹6,300', trend: 'up' },
  { name: 'Mustard', price: '₹5,200', high: '₹5,350', low: '₹5,100', trend: 'up' },
];

const MarketTicker = () => {
  return (
    <div className="market-ticker-container">
      <div className="ticker-label">Live Market</div>
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {/* Double the array to ensure smooth infinite scrolling */}
          {tickerData.concat(tickerData).map((item, index) => (
            <div key={index} className="ticker-item">
              <span className="ticker-name">{item.name}</span>
              <span className="ticker-price">{item.price}</span>
              <span className={`ticker-trend ${item.trend}`}>
                {item.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </span>
              <span className="ticker-highlow">
                (H: {item.high} | L: {item.low})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;
