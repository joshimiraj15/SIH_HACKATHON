// src/components/views/PriceJourney.jsx
import React, { useState } from 'react';
import { translations } from '../../data/translations';
import { 
  Sprout, 
  Store, 
  Building2, 
  ShoppingBag, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  Truck,
  DollarSign,
  Info,
  ChevronDown
} from 'lucide-react';
import '../../styles/PriceJourney.css';

const JOURNEY_DATA = {
  Wheat: {
    crop: 'Wheat (Sharbati Lokwan)',
    emoji: '🌾',
    metrics: {
      farmerPrice: 2100,
      marketPrice: 2350,
      buyerOffer: 2610,
      transportCost: 150,
      finalProfit: 2460,
      retailPrice: 3400
    },
    stages: [
      {
        id: 'harvest',
        num: '01',
        title: 'Harvest',
        subtitle: 'Farm Gate',
        price: '₹2,100 / Qtl',
        actor: 'Farmer',
        desc: 'Direct harvest cost, threshing & farm gate storage.',
        icon: Sprout
      },
      {
        id: 'local-market',
        num: '02',
        title: 'Local Market',
        subtitle: 'Village Yard',
        price: '₹2,350 / Qtl',
        actor: 'Village Commission Agent',
        desc: 'Aggregation, grading & basic cleaning markup.',
        icon: Store
      },
      {
        id: 'wholesale-market',
        num: '03',
        title: 'Wholesale Market',
        subtitle: 'APMC Mega Mandi',
        price: '₹2,480 / Qtl',
        actor: 'APMC Wholesaler',
        desc: 'Auction bidding, weighbridge & regional mandi tax.',
        icon: Building2
      },
      {
        id: 'buyer',
        num: '04',
        title: 'Buyer',
        subtitle: 'Food Processor',
        price: '₹2,610 / Qtl',
        actor: 'AgroFresh Corp',
        desc: 'Contract buying, industrial packaging & milling.',
        icon: Truck,
        isHighlighted: true
      },
      {
        id: 'final-sale',
        num: '05',
        title: 'Final Sale',
        subtitle: 'Consumer Retail',
        price: '₹3,400 / Qtl',
        actor: 'Supermarkets & Retailers',
        desc: 'Consumer retail shelf rate in Ahmedabad & Mumbai.',
        icon: ShoppingBag
      }
    ]
  },
  Cotton: {
    crop: 'Cotton (Shankar-6)',
    emoji: '🌱',
    metrics: {
      farmerPrice: 6600,
      marketPrice: 7100,
      buyerOffer: 7450,
      transportCost: 280,
      finalProfit: 7170,
      retailPrice: 9800
    },
    stages: [
      {
        id: 'harvest',
        num: '01',
        title: 'Harvest',
        subtitle: 'Farm Gate',
        price: '₹6,600 / Qtl',
        actor: 'Farmer',
        desc: 'Manual picking & moisture control at farm.',
        icon: Sprout
      },
      {
        id: 'local-market',
        num: '02',
        title: 'Local Market',
        subtitle: 'Taluka Yard',
        price: '₹7,100 / Qtl',
        actor: 'Local Ginning Agent',
        desc: 'Moisture deduction and raw bale aggregation.',
        icon: Store
      },
      {
        id: 'wholesale-market',
        num: '03',
        title: 'Wholesale Market',
        subtitle: 'Botad APMC',
        price: '₹7,280 / Qtl',
        actor: 'Cotton Yard Wholesaler',
        desc: 'Commercial auction bidding & staple grading.',
        icon: Building2
      },
      {
        id: 'buyer',
        num: '04',
        title: 'Buyer',
        subtitle: 'Spinning Mill',
        price: '₹7,450 / Qtl',
        actor: 'Saurashtra Spin Mills',
        desc: 'Direct corporate bulk delivery order.',
        icon: Truck,
        isHighlighted: true
      },
      {
        id: 'final-sale',
        num: '05',
        title: 'Final Sale',
        subtitle: 'Textile Export',
        price: '₹9,800 / Qtl',
        actor: 'Garment Exporters',
        desc: 'Yarn and combed cotton fabric retail valuation.',
        icon: ShoppingBag
      }
    ]
  },
  Tomato: {
    crop: 'Tomato (Hybrid Red)',
    emoji: '🍅',
    metrics: {
      farmerPrice: 1500,
      marketPrice: 1850,
      buyerOffer: 2150,
      transportCost: 120,
      finalProfit: 2030,
      retailPrice: 3200
    },
    stages: [
      {
        id: 'harvest',
        num: '01',
        title: 'Harvest',
        subtitle: 'Farm Gate',
        price: '₹1,500 / Qtl',
        actor: 'Farmer',
        desc: 'Plucking, sorting into 25kg plastic crates.',
        icon: Sprout
      },
      {
        id: 'local-market',
        num: '02',
        title: 'Local Market',
        subtitle: 'Sub-Mandi Yard',
        price: '₹1,850 / Qtl',
        actor: 'Local Aggregator',
        desc: 'Cold storage handling and grading markup.',
        icon: Store
      },
      {
        id: 'wholesale-market',
        num: '03',
        title: 'Wholesale Market',
        subtitle: 'Rajkot APMC',
        price: '₹1,980 / Qtl',
        actor: 'Commission Agent',
        desc: 'Morning vegetable auction & dispatch loading.',
        icon: Building2
      },
      {
        id: 'buyer',
        num: '04',
        title: 'Buyer',
        subtitle: 'Ketchup Processor',
        price: '₹2,150 / Qtl',
        actor: 'Kisan Konnect Purees',
        desc: 'Contract processing procurement for canning.',
        icon: Truck,
        isHighlighted: true
      },
      {
        id: 'final-sale',
        num: '05',
        title: 'Final Sale',
        subtitle: 'Retail Stores',
        price: '₹3,200 / Qtl',
        actor: 'City Retail Outlets',
        desc: 'Consumer retail grocery market shelves.',
        icon: ShoppingBag
      }
    ]
  }
};

const PriceJourney = ({ setActiveTab, language }) => {
  const t = translations[language] || translations.en;
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const journey = JOURNEY_DATA[selectedCrop] || JOURNEY_DATA.Wheat;

  return (
    <div className="price-journey-container">
      {/* Header */}
      <div className="journey-header">
        <div>
          <span className="section-micro-tag">{t.supplyChainTransparency}</span>
          <h1>{t.cropPriceJourneyValueChain}</h1>
          <p>
            {t.trackPriceChanges}
          </p>
        </div>

        {/* Crop Selector */}
        <div className="journey-crop-switcher">
          {Object.keys(JOURNEY_DATA).map((cKey) => (
            <button
              key={cKey}
              type="button"
              className={`journey-crop-btn ${selectedCrop === cKey ? 'active' : ''}`}
              onClick={() => setSelectedCrop(cKey)}
            >
              <span>{JOURNEY_DATA[cKey].emoji}</span>
              <span>{cKey}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5 Required Metrics Cards: Farmer price, Market price, Buyer offer, Transportation cost, Final profit */}
      <div className="journey-metrics-cards-row">
        <div className="journey-metric-card">
          <span className="j-lbl">{t.farmerPriceLbl}</span>
          <strong className="j-val text-gray-900">₹{journey.metrics.farmerPrice.toLocaleString()}</strong>
          <span className="j-sub">{t.gateRateHarvest}</span>
        </div>

        <div className="journey-metric-card">
          <span className="j-lbl">{t.marketPriceLbl}</span>
          <strong className="j-val text-gray-900">₹{journey.metrics.marketPrice.toLocaleString()}</strong>
          <span className="j-sub">{t.apmcAuctionRate}</span>
        </div>

        <div className="journey-metric-card highlight-buyer">
          <span className="j-lbl">{t.buyerOfferKisanLink}</span>
          <strong className="j-val text-emerald-700">₹{journey.metrics.buyerOffer.toLocaleString()}</strong>
          <span className="j-sub">{t.verifiedInstBid}</span>
        </div>

        <div className="journey-metric-card">
          <span className="j-lbl">{t.transportCostLbl || "Transportation Cost"}</span>
          <strong className="j-val text-red-600">- ₹{journey.metrics.transportCost.toLocaleString()}</strong>
          <span className="j-sub">{t.avgFreightQtl}</span>
        </div>

        <div className="journey-metric-card highlight-profit">
          <span className="j-lbl">{t.finalNetProfitLbl}</span>
          <strong className="j-val text-emerald-800">₹{journey.metrics.finalProfit.toLocaleString()}</strong>
          <span className="j-sub">{t.vsTradMiddlemen}</span>
        </div>
      </div>

      {/* ══ 5-STAGE TIMELINE PER SPECIFICATION ══ */}
      <div className="journey-timeline-card">
        <div className="timeline-title-row">
          <h3 className="timeline-h3">{t.fiveStageProgression}</h3>
          <span className="timeline-note-badge">{t.timelineFlowLegend}</span>
        </div>

        <div className="timeline-flow-steps">
          {journey.stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <React.Fragment key={stage.id}>
                <div className={`timeline-node-item ${stage.isHighlighted ? 'highlighted-node' : ''}`}>
                  <div className="node-step-tag">{stage.num}</div>
                  <div className="node-icon-wrapper">
                    <Icon size={24} />
                  </div>

                  <div className="node-heading-block">
                    <h4 className="node-stage-title">{stage.title === "Harvest" ? t.stageHarvest : stage.title === "Local Market" ? t.stageLocalMarket : stage.title === "Wholesale Market" ? t.stageWholesaleMarket : stage.title === "Buyer" ? t.stageBuyer : stage.title === "Final Sale" ? t.stageFinalSale : stage.title}</h4>
                    <span className="node-subtitle">{stage.subtitle === "Farm Gate" ? t.subtitleFarmGate : stage.subtitle === "Village Yard" ? t.subtitleVillageYard : stage.subtitle === "Taluka Yard" ? t.subtitleTalukaYard : stage.subtitle === "Sub-Mandi Yard" ? t.subtitleSubMandiYard : stage.subtitle === "Consumer Retail" ? t.subtitleConsumerRetail : stage.subtitle === "Textile Export" ? t.subtitleTextileExport : stage.subtitle === "Retail Stores" ? t.subtitleRetailStores : stage.subtitle}</span>
                  </div>

                  <div className="node-price-display">
                    <strong>{stage.price}</strong>
                  </div>

                  <div className="node-actor-text">
                    {t.byLbl} <strong>{stage.actor}</strong>
                  </div>

                  <p className="node-desc-text">
                    {stage.desc}
                  </p>
                </div>

                {idx < journey.stages.length - 1 && (
                  <div className="timeline-connector-arrow">
                    <ArrowRight size={22} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Value Retention Comparison Banner */}
      <div className="value-retention-banner">
        <div className="retention-icon-box">
          <ShieldCheck size={28} color="#047857" />
        </div>
        <div>
          <h4>{t.kisanLinkAdvantage}</h4>
          <p dangerouslySetInnerHTML={{ __html: t.kisanLinkAdvantageDesc ? t.kisanLinkAdvantageDesc : "When selling through traditional broker tiers, farmers only retain <strong>~52%</strong> of the final consumer price. With KisanSetu's direct connection to verified buyers, you retain up to <strong>76%</strong> of the commodity value." }}></p>
        </div>
        <button 
          type="button" 
          className="btn-retention-action"
          onClick={() => setActiveTab('buyers')}
        >
          <span>{t.connectDirectBuyers}</span>
        </button>
      </div>
    </div>
  );
};

export default PriceJourney;
