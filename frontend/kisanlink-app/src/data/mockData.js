// src/data/mockData.js
// Complete dataset for KisanSetu Agricultural Intelligence Platform

export const farmerProfile = {
  id: "KGP123456",
  name: "Meet Maniya",
  role: "Farmer",
  location: "Rajkot, Gujarat",
  village: "Kuvadva, Rajkot",
  landSize: "3.5 Acres",
  primaryCrops: ["Wheat", "Tomato"],
  phone: "+91 98765 43210",
  email: "meetmaniya@gmail.com",
  joinedDate: "March 2024",
  bankLinked: "State Bank of India (Ending 4821)",
  kisanCreditCard: "Active (₹3,00,000 limit)",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
};

export const weatherInfo = {
  city: "Rajkot",
  temp: "31°C",
  condition: "Sunny",
  humidity: "42%",
  wind: "14 km/h",
  rainForecast: "0% in next 48 hrs"
};

export const heroWheatData = {
  crop: "Wheat",
  tag: "Trending",
  currentPrice: "2,480",
  unit: "Quintal",
  change: "+8.4%",
  period: "Today",
  demand: "High",
  supply: "Low",
  outlook: "Bullish",
  bestSellingWindow: "Next 48 Hours",
  demandChange: "+18%",
  supplyChange: "-7%"
};

export const quickStats = {
  bestMandi: {
    title: "Best Mandi Today",
    name: "Rajkot APMC",
    price: "2,610",
    unit: "/ Q",
    badge: "+5.2%",
    badgeType: "positive"
  },
  nearestBuyer: {
    title: "Nearest Buyer",
    name: "AgroFresh Foods",
    distance: "12.4 km",
    badge: "Top Rated",
    badgeType: "highlight"
  },
  expectedPrice: {
    title: "Expected Price",
    price: "2,720",
    unit: "/ Q",
    badge: "+6.4%",
    badgeType: "positive"
  }
};

export const priceTrend7Days = [
  { day: "Mon", price: 2320 },
  { day: "Tue", price: 2360 },
  { day: "Wed", price: 2410 },
  { day: "Thu", price: 2390 },
  { day: "Fri", price: 2440 },
  { day: "Sat", price: 2470 },
  { day: "Sun", price: 2480 }
];

export const myCropsData = [
  {
    id: "crop-1",
    name: "Wheat",
    variety: "Sharbati Gold",
    quantity: "500 kg",
    qtyValue: 500,
    price: "2,480",
    unit: "/ Q",
    change: "+6.4%",
    trend: "up",
    status: "Ready for Mandi",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80",
    health: "Good Health",
    nextAction: "Irrigation needed in 3 days."
  },
  {
    id: "crop-2",
    name: "Tomato",
    variety: "Desi Hybrid",
    quantity: "300 kg",
    qtyValue: 300,
    price: "2,650",
    unit: "/ Q",
    change: "+8.2%",
    trend: "up",
    status: "Harvesting Peak",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80",
    health: "Excellent",
    nextAction: "High market demand. Sell within 48h."
  },
  {
    id: "crop-3",
    name: "Onion",
    variety: "Nashik Red",
    quantity: "400 kg",
    qtyValue: 400,
    price: "2,420",
    unit: "/ Q",
    change: "-4.1%",
    trend: "down",
    status: "Storage Safe",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80",
    health: "Good Health",
    nextAction: "Hold stock; prices expected to bounce next week."
  },
  {
    id: "crop-4",
    name: "Potato",
    variety: "Pukhraj Premium",
    quantity: "600 kg",
    qtyValue: 600,
    price: "2,310",
    unit: "/ Q",
    change: "+3.7%",
    trend: "up",
    status: "In Storage",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80",
    health: "Normal",
    nextAction: "Cold storage check scheduled in 5 days."
  }
];

export const radarMandis = [
  {
    id: "mandi-rajkot",
    name: "Rajkot APMC",
    city: "Rajkot",
    state: "Gujarat",
    price: 2610,
    priceFormatted: "₹2,610",
    change: "+5.2%",
    trend: "up",
    isTop: true,
    distanceKm: 12.4,
    coords: { x: 38, y: 56 }, // SVG coordinate percentages
    rating: 4.8,
    dailyArrival: "450 Tonnes",
    activeBuyers: 42
  },
  {
    id: "mandi-ahmedabad",
    name: "Ahmedabad APMC",
    city: "Ahmedabad",
    state: "Gujarat",
    price: 2530,
    priceFormatted: "₹2,530",
    change: "+3.8%",
    trend: "up",
    isTop: false,
    distanceKm: 102,
    coords: { x: 62, y: 38 },
    rating: 4.6,
    dailyArrival: "820 Tonnes",
    activeBuyers: 68
  },
  {
    id: "mandi-surat",
    name: "Surat APMC",
    city: "Surat",
    state: "Gujarat",
    price: 2290,
    priceFormatted: "₹2,290",
    change: "-2.1%",
    trend: "down",
    isTop: false,
    distanceKm: 285,
    coords: { x: 74, y: 78 },
    rating: 4.4,
    dailyArrival: "610 Tonnes",
    activeBuyers: 35
  },
  {
    id: "mandi-junagadh",
    name: "Junagadh APMC",
    city: "Junagadh",
    state: "Gujarat",
    price: 2480,
    priceFormatted: "₹2,480",
    change: "+1.9%",
    trend: "up",
    isTop: false,
    distanceKm: 45.2,
    coords: { x: 32, y: 72 },
    rating: 4.5,
    dailyArrival: "290 Tonnes",
    activeBuyers: 28
  },
  {
    id: "mandi-vadodara",
    name: "Vadodara APMC",
    city: "Vadodara",
    state: "Gujarat",
    price: 2450,
    priceFormatted: "₹2,450",
    change: "+0.8%",
    trend: "up",
    isTop: false,
    distanceKm: 190,
    coords: { x: 70, y: 52 },
    rating: 4.5,
    dailyArrival: "380 Tonnes",
    activeBuyers: 31
  }
];

export const whereToSellComparison = [
  {
    mandi: "Rajkot APMC",
    pricePerQ: 2610,
    priceStr: "₹2,610",
    distance: "12.4 km",
    transportCost: 850,
    grossRevenue: 12400,
    netEarnings: "₹11,550",
    netValue: 11550,
    isBest: true,
    highlight: "(Best)"
  },
  {
    mandi: "Junagadh",
    pricePerQ: 2530,
    priceStr: "₹2,530",
    distance: "45.2 km",
    transportCost: 1830,
    grossRevenue: 12650,
    netEarnings: "₹10,820",
    netValue: 10820,
    isBest: false
  },
  {
    mandi: "Ahmedabad",
    pricePerQ: 2480,
    priceStr: "₹2,480",
    distance: "102 km",
    transportCost: 2640,
    grossRevenue: 12400,
    netEarnings: "₹9,760",
    netValue: 9760,
    isBest: false
  }
];

export const buyersList = [
  {
    id: "buyer-1",
    name: "AgroFresh Foods",
    cropSpecialty: "Potato Buyer",
    category: "Vegetables",
    distance: "18 km",
    rating: 4.8,
    dealsCount: 124,
    offeredPrice: "₹24.5/kg",
    priceValue: 24.5,
    demandTag: "High Demand",
    isVerified: true,
    avatarColor: "#10B981",
    produceEmoji: "🥔",
    description: "Leading processing unit supplying food chains across western India. Instant UPI payment upon weighing.",
    paymentTerms: "100% Instant Bank Transfer",
    pickupAvailable: true,
    minimumQuantity: "300 kg"
  },
  {
    id: "buyer-2",
    name: "GreenLeaf Exports",
    cropSpecialty: "Tomato Buyer",
    category: "Vegetables",
    distance: "22 km",
    rating: 4.7,
    dealsCount: 98,
    offeredPrice: "₹26.0/kg",
    priceValue: 26.0,
    demandTag: "High Demand",
    isVerified: true,
    avatarColor: "#22C55E",
    produceEmoji: "🍅",
    description: "Certified agricultural exporters looking for Grade-A fresh farm tomatoes with direct farm pickup.",
    paymentTerms: "Instant Digital Settlement",
    pickupAvailable: true,
    minimumQuantity: "250 kg"
  },
  {
    id: "buyer-3",
    name: "Shree Sai Traders",
    cropSpecialty: "Onion Buyer",
    category: "Vegetables",
    distance: "15 km",
    rating: 4.6,
    dealsCount: 87,
    offeredPrice: "₹18.0/kg",
    priceValue: 18.0,
    demandTag: "High Demand",
    isVerified: true,
    avatarColor: "#F59E0B",
    produceEmoji: "🧅",
    description: "Wholesale distributor supply to major municipal markets with zero broker commission deduction.",
    paymentTerms: "On-spot Cash or RTGS",
    pickupAvailable: false,
    minimumQuantity: "400 kg"
  },
  {
    id: "buyer-4",
    name: "FreshFarm Foods",
    cropSpecialty: "Wheat Buyer",
    category: "Grains",
    distance: "30 km",
    rating: 4.5,
    dealsCount: 64,
    offeredPrice: "₹22.0/kg",
    priceValue: 22.0,
    demandTag: "Medium Demand",
    isVerified: true,
    avatarColor: "#EAB308",
    produceEmoji: "🌾",
    description: "Flour milling consortium purchasing Sharbati and Lokwan varieties with moisture testing support.",
    paymentTerms: "Next-day NEFT Direct Credit",
    pickupAvailable: true,
    minimumQuantity: "500 kg"
  },
  {
    id: "buyer-5",
    name: "Gujarat Fruit Corp",
    cropSpecialty: "Mango & Papaya",
    category: "Fruits",
    distance: "25 km",
    rating: 4.9,
    dealsCount: 152,
    offeredPrice: "₹48.0/kg",
    priceValue: 48.0,
    demandTag: "High Demand",
    isVerified: true,
    avatarColor: "#F97316",
    produceEmoji: "🥭",
    description: "Bulk fruit aggregator offering premium contracts for orchard farmers across Saurashtra.",
    paymentTerms: "Direct Bank Transfer",
    pickupAvailable: true,
    minimumQuantity: "200 kg"
  },
  {
    id: "buyer-6",
    name: "KisanPulse Agro",
    cropSpecialty: "Pulses & Gram",
    category: "Grains",
    distance: "35 km",
    rating: 4.6,
    dealsCount: 71,
    offeredPrice: "₹62.0/kg",
    priceValue: 62.0,
    demandTag: "High Demand",
    isVerified: true,
    avatarColor: "#8B5CF6",
    produceEmoji: "🌱",
    description: "Government-approved procurement partner offering MSP + bonus margin for organic certified pulses.",
    paymentTerms: "Instant Direct Benefit Transfer",
    pickupAvailable: true,
    minimumQuantity: "500 kg"
  }
];

export const priceForecastData = {
  selectedCrop: "Tomato",
  currentPrice: "28/kg",
  currentPriceValue: 28,
  projectedCards: [
    { label: "Tomorrow", price: "₹30/kg", change: "+7%", trend: "up" },
    { label: "3 Days", price: "₹34/kg", change: "+21%", trend: "up", highlight: true },
    { label: "7 Days", price: "₹31/kg", change: "+9%", trend: "up" }
  ],
  insightTitle: "Prediction Insight",
  insightText: "Waiting 2 days may increase expected earnings by ₹2,100",
  chartPoints: [
    { label: "Today", day: 0, price: 28, lower: 27, upper: 29 },
    { label: "3D", day: 3, price: 34, lower: 31, upper: 37 },
    { label: "5D", day: 5, price: 32, lower: 29, upper: 35 },
    { label: "7D", day: 7, price: 31, lower: 28, upper: 34 },
    { label: "10D", day: 10, price: 35, lower: 30, upper: 39 },
    { label: "14D", day: 14, price: 33, lower: 27, upper: 38 }
  ]
};

export const priceJourneyData = {
  stages: [
    {
      id: 1,
      title: "Farmer",
      price: "₹18/kg",
      priceValue: 18,
      share: "56%",
      isHighlighted: true,
      iconName: "User",
      desc: "Received at farm gate"
    },
    {
      id: 2,
      title: "Collection Center",
      price: "₹21/kg",
      priceValue: 21,
      share: "65%",
      isHighlighted: false,
      iconName: "Warehouse",
      desc: "Grading & sorting"
    },
    {
      id: 3,
      title: "Mandi",
      price: "₹25/kg",
      priceValue: 25,
      share: "78%",
      isHighlighted: false,
      iconName: "Store",
      desc: "Auction & commission"
    },
    {
      id: 4,
      title: "Final Buyer",
      price: "₹32/kg",
      priceValue: 32,
      share: "100%",
      isHighlighted: false,
      iconName: "ShoppingBag",
      desc: "Retail consumer price"
    }
  ],
  insightCallout: "You are receiving only 56% of final market value. Better market linkages can help you get higher profits.",
  breakdown: [
    { label: "Farmer Share", percent: 56, amount: "₹18", color: "#16A34A" },
    { label: "Middlemen & Transport", percent: 24, amount: "₹8", color: "#F59E0B" },
    { label: "Mandi Charges", percent: 12, amount: "₹4", color: "#64748B" },
    { label: "Others", percent: 8, amount: "₹2", color: "#94A3B8" }
  ]
};

export const recentActivities = [
  {
    id: "act-1",
    title: "Price updated for Tomato",
    detail: "+6.2%",
    time: "2 hrs ago",
    type: "price",
    icon: "TrendingUp"
  },
  {
    id: "act-2",
    title: "New buyer matched",
    detail: "AgroFresh Foods",
    time: "4 hrs ago",
    type: "buyer",
    icon: "Users"
  },
  {
    id: "act-3",
    title: "Crop added",
    detail: "Onion",
    time: "1 day ago",
    type: "crop",
    icon: "PlusCircle"
  }
];

export const governmentSchemes = [
  {
    id: "scheme-1",
    title: "PM-KISAN Samman Nidhi",
    benefit: "₹6,000 / year direct benefit",
    status: "Enrolled & Active",
    nextInstallment: "Expected in 15 days"
  },
  {
    id: "scheme-2",
    title: "Gujarat Kisan Sahay Yojana",
    benefit: "Up to ₹25,000 / hectare crop damage cover",
    status: "Eligible to Apply",
    action: "Apply with 1-Click"
  },
  {
    id: "scheme-3",
    title: "Pradhan Mantri Krishi Sinchayee Yojana (Drip Subsidy)",
    benefit: "70% subsidy on micro-irrigation systems",
    status: "Verified",
    action: "View Sanction Letter"
  }
];

export const notificationsList = [
  {
    id: "n-1",
    title: "Price Alert: Wheat rate surging!",
    message: "Rajkot APMC wheat rate crossed ₹2,600/Q today. Best time to sell.",
    time: "10 mins ago",
    read: false,
    type: "alert"
  },
  {
    id: "n-2",
    title: "Buyer Interest Received",
    message: "GreenLeaf Exports sent an inquiry for 300kg Tomato at ₹26/kg.",
    time: "1 hour ago",
    read: false,
    type: "offer"
  },
  {
    id: "n-3",
    title: "Weather Advisory",
    message: "Clear skies and optimal harvest conditions in Rajkot for next 4 days.",
    time: "5 hours ago",
    read: true,
    type: "weather"
  }
];
