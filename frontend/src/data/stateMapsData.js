// src/data/stateMapsData.js
// High-fidelity district maps and APMC mandi market centers for Indian Agricultural States

import gujaratMapImg from '../assets/gujarat-map.png';

export const STATE_MAPS = {
  Gujarat: {
    id: 'Gujarat',
    name: 'Gujarat',
    label: 'ગુજરાત (Gujarat)',
    capital: 'Gandhinagar',
    mapImage: gujaratMapImg,
    primaryCrops: ['Wheat', 'Cotton', 'Groundnut', 'Tomato', 'Onion', 'Potato', 'Cumin', 'Castor'],
    viewBox: '0 0 1024 812',
    mandis: [
      {
        id: 'rajkot',
        name: 'Rajkot APMC Mega Yard',
        city: 'Rajkot',
        district: 'Rajkot',
        coords: { x: 42.0, y: 55.5 },
        basePrice: 2610,
        arrivalVol: '480 MT',
        distance: '14 km',
        trend: 'up',
        change: '+ ₹180',
        demand: 'High',
        priceLevel: 'high',
        isTop: true,
        specialty: 'Sharbati Wheat & Groundnut'
      },
      {
        id: 'gondal',
        name: 'Gondal APMC Yard',
        city: 'Gondal',
        district: 'Rajkot',
        coords: { x: 41.5, y: 60.5 },
        basePrice: 2580,
        arrivalVol: '390 MT',
        distance: '38 km',
        trend: 'up',
        change: '+ ₹120',
        demand: 'High',
        priceLevel: 'high',
        isTop: false,
        specialty: 'Red Chilli & Groundnut'
      },
      {
        id: 'ahmedabad',
        name: 'Ahmedabad APMC Jamalpur',
        city: 'Ahmedabad',
        district: 'Ahmedabad',
        coords: { x: 63.5, y: 36.5 },
        basePrice: 2530,
        arrivalVol: '320 MT',
        distance: '215 km',
        trend: 'up',
        change: '+ ₹60',
        demand: 'Medium',
        priceLevel: 'medium',
        isTop: false,
        specialty: 'Vegetables & Cotton'
      },
      {
        id: 'surat',
        name: 'Surat APMC Mandi Market',
        city: 'Surat',
        district: 'Surat',
        coords: { x: 66.0, y: 68.5 },
        basePrice: 2570,
        arrivalVol: '410 MT',
        distance: '290 km',
        trend: 'up',
        change: '+ ₹110',
        demand: 'High',
        priceLevel: 'high',
        isTop: false,
        specialty: 'Sugarcane & Vegetables'
      },
      {
        id: 'junagadh',
        name: 'Junagadh APMC Yard',
        city: 'Junagadh',
        district: 'Junagadh',
        coords: { x: 36.5, y: 65.5 },
        basePrice: 2480,
        arrivalVol: '240 MT',
        distance: '102 km',
        trend: 'down',
        change: '- ₹40',
        demand: 'Normal',
        priceLevel: 'low',
        isTop: false,
        specialty: 'Kesar Mango & Sesame'
      },
      {
        id: 'morbi',
        name: 'Morbi APMC Yard',
        city: 'Morbi',
        district: 'Morbi',
        coords: { x: 40.0, y: 36.5 },
        basePrice: 2500,
        arrivalVol: '250 MT',
        distance: '65 km',
        trend: 'up',
        change: '+ ₹70',
        demand: 'Medium',
        priceLevel: 'medium',
        isTop: false,
        specialty: 'Cotton & Cumin'
      },
      {
        id: 'jamnagar',
        name: 'Jamnagar APMC Yard',
        city: 'Jamnagar',
        district: 'Jamnagar',
        coords: { x: 31.5, y: 50.5 },
        basePrice: 2490,
        arrivalVol: '270 MT',
        distance: '90 km',
        trend: 'up',
        change: '+ ₹60',
        demand: 'Medium',
        priceLevel: 'medium',
        isTop: false,
        specialty: 'Groundnut & Cumin'
      },
      {
        id: 'botad',
        name: 'Botad APMC Yard',
        city: 'Botad',
        district: 'Botad',
        coords: { x: 51.0, y: 53.5 },
        basePrice: 2550,
        arrivalVol: '290 MT',
        distance: '95 km',
        trend: 'up',
        change: '+ ₹100',
        demand: 'High',
        priceLevel: 'high',
        isTop: false,
        specialty: 'Cotton & Wheat'
      },
      {
        id: 'bhavnagar',
        name: 'Bhavnagar APMC Yard',
        city: 'Bhavnagar',
        district: 'Bhavnagar',
        coords: { x: 59.0, y: 60.5 },
        basePrice: 2520,
        arrivalVol: '310 MT',
        distance: '175 km',
        trend: 'up',
        change: '+ ₹90',
        demand: 'Medium',
        priceLevel: 'medium',
        isTop: false,
        specialty: 'Garva Red Onion'
      },
      {
        id: 'amreli',
        name: 'Amreli APMC Yard',
        city: 'Amreli',
        district: 'Amreli',
        coords: { x: 48.5, y: 67.0 },
        basePrice: 2510,
        arrivalVol: '260 MT',
        distance: '115 km',
        trend: 'up',
        change: '+ ₹85',
        demand: 'Medium',
        priceLevel: 'medium',
        isTop: false,
        specialty: 'Cotton & Sesame'
      },
      {
        id: 'surendranagar',
        name: 'Surendranagar Cotton Yard',
        city: 'Surendranagar',
        district: 'Surendranagar',
        coords: { x: 50.0, y: 40.0 },
        basePrice: 2560,
        arrivalVol: '380 MT',
        distance: '110 km',
        trend: 'up',
        change: '+ ₹110',
        isTop: false,
        specialty: 'Shankar-6 Cotton & Cumin'
      },
      {
        id: 'deesa',
        name: 'Deesa APMC Potato Hub',
        city: 'Banaskantha',
        district: 'Banaskantha',
        coords: { x: 61.0, y: 10.5 },
        basePrice: 2490,
        arrivalVol: '560 MT',
        distance: '310 km',
        trend: 'up',
        change: '+ ₹110',
        isTop: false,
        specialty: 'Kufri Potato & Mustard'
      },
      {
        id: 'patan',
        name: 'Patan APMC Yard',
        city: 'Patan',
        district: 'Patan',
        coords: { x: 56.5, y: 21.5 },
        basePrice: 2470,
        arrivalVol: '280 MT',
        distance: '270 km',
        trend: 'down',
        change: '- ₹30',
        isTop: false,
        specialty: 'Castor Seed & Mustard'
      },
      {
        id: 'mehsana',
        name: 'Mehsana APMC Market',
        city: 'Mehsana',
        district: 'Mehsana',
        coords: { x: 63.0, y: 26.5 },
        basePrice: 2510,
        arrivalVol: '310 MT',
        distance: '250 km',
        trend: 'up',
        change: '+ ₹80',
        isTop: false,
        specialty: 'Fennel (Variyali) & Cumin'
      },
      {
        id: 'anand',
        name: 'Anand APMC Vegetable Yard',
        city: 'Anand',
        district: 'Anand',
        coords: { x: 68.5, y: 47.0 },
        basePrice: 2520,
        arrivalVol: '340 MT',
        distance: '260 km',
        trend: 'up',
        change: '+ ₹85',
        isTop: false,
        specialty: 'Banana & Tobacco'
      },
      {
        id: 'vadodara',
        name: 'Vadodara APMC Sayajipura',
        city: 'Vadodara',
        district: 'Vadodara',
        coords: { x: 74.5, y: 53.5 },
        basePrice: 2450,
        arrivalVol: '210 MT',
        distance: '280 km',
        trend: 'down',
        change: '- ₹70',
        isTop: false,
        specialty: 'Cotton & Pulses'
      },
      {
        id: 'bharuch',
        name: 'Bharuch APMC Yard',
        city: 'Bharuch',
        district: 'Bharuch',
        coords: { x: 72.0, y: 61.0 },
        basePrice: 2410,
        arrivalVol: '230 MT',
        distance: '340 km',
        trend: 'down',
        change: '- ₹60',
        isTop: false,
        specialty: 'Cotton & Pigeon Pea'
      },
      {
        id: 'surat',
        name: 'Surat APMC Sahara Darwaja',
        city: 'Surat',
        district: 'Surat',
        coords: { x: 70.5, y: 71.5 },
        basePrice: 2290,
        arrivalVol: '290 MT',
        distance: '420 km',
        trend: 'down',
        change: '- ₹120',
        isTop: false,
        specialty: 'Sugarcane & Vegetables'
      },
      {
        id: 'kutch',
        name: 'Bhuj APMC (Kutch Yard)',
        city: 'Kutch',
        district: 'Kutch',
        coords: { x: 25.5, y: 30.0 },
        basePrice: 2570,
        arrivalVol: '310 MT',
        distance: '230 km',
        trend: 'up',
        change: '+ ₹130',
        isTop: false,
        specialty: 'Kutch Dates & Cumin'
      }
    ]
  },

  Maharashtra: {
    id: 'Maharashtra',
    name: 'Maharashtra',
    label: 'महाराष्ट्र (Maharashtra)',
    capital: 'Mumbai',
    primaryCrops: ['Onion', 'Cotton', 'Sugarcane', 'Soybean', 'Tomato', 'Wheat'],
    viewBox: '0 0 520 380',
    svgPath: `
      M 60 130
      C 90 90, 160 80, 240 70
      C 320 60, 420 80, 480 120
      C 495 150, 460 200, 420 230
      C 380 260, 340 310, 270 330
      C 210 345, 150 320, 110 290
      C 90 270, 70 220, 60 180 Z
    `,
    mandis: [
      {
        id: 'nashik',
        name: 'Lasalgaon APMC (Nashik)',
        city: 'Nashik',
        district: 'Nashik',
        coords: { x: 28, y: 35 },
        basePrice: 2840,
        arrivalVol: '620 MT',
        distance: '480 km',
        trend: 'up',
        change: '+ ₹240',
        isTop: true,
        specialty: "Asia's #1 Onion Mandi & Table Grapes"
      },
      {
        id: 'pune',
        name: 'Pune APMC Gultekdi Market',
        city: 'Pune',
        district: 'Pune',
        coords: { x: 32, y: 55 },
        basePrice: 2690,
        arrivalVol: '440 MT',
        distance: '560 km',
        trend: 'up',
        change: '+ ₹110',
        isTop: false,
        specialty: 'Exotic Vegetables & Floriculture'
      },
      {
        id: 'nagpur',
        name: 'Nagpur APMC Kalamna Yard',
        city: 'Nagpur',
        district: 'Nagpur',
        coords: { x: 80, y: 32 },
        basePrice: 2590,
        arrivalVol: '380 MT',
        distance: '850 km',
        trend: 'up',
        change: '+ ₹80',
        isTop: false,
        specialty: 'Nagpur Santra (Oranges) & Soybean'
      },
      {
        id: 'kolhapur',
        name: 'Kolhapur APMC Shahu Market',
        city: 'Kolhapur',
        district: 'Kolhapur',
        coords: { x: 26, y: 78 },
        basePrice: 2620,
        arrivalVol: '310 MT',
        distance: '690 km',
        trend: 'up',
        change: '+ ₹95',
        isTop: false,
        specialty: 'Jaggery & Sugarcane'
      },
      {
        id: 'sambhajinagar',
        name: 'Chhatrapati Sambhajinagar APMC',
        city: 'Aurangabad',
        district: 'Chhatrapati Sambhajinagar',
        coords: { x: 44, y: 42 },
        basePrice: 2510,
        arrivalVol: '290 MT',
        distance: '510 km',
        trend: 'down',
        change: '- ₹50',
        isTop: false,
        specialty: 'Cotton & Bajra'
      }
    ]
  },

  Punjab: {
    id: 'Punjab',
    name: 'Punjab',
    label: 'ਪੰਜਾਬ (Punjab)',
    capital: 'Chandigarh',
    primaryCrops: ['Wheat', 'Basmati Rice', 'Cotton', 'Potato', 'Mustard'],
    viewBox: '0 0 520 380',
    svgPath: `
      M 160 50
      C 220 40, 310 60, 370 90
      C 390 140, 370 210, 340 270
      C 310 320, 240 340, 180 320
      C 130 290, 100 230, 95 170
      C 90 120, 120 70, 160 50 Z
    `,
    mandis: [
      {
        id: 'ludhiana',
        name: 'Ludhiana Dana Mandi Yard',
        city: 'Ludhiana',
        district: 'Ludhiana',
        coords: { x: 46, y: 48 },
        basePrice: 2720,
        arrivalVol: '780 MT',
        distance: '1,120 km',
        trend: 'up',
        change: '+ ₹160',
        isTop: true,
        specialty: 'Kanak (Wheat) & Basmati Paddy'
      },
      {
        id: 'amritsar',
        name: 'Amritsar Bhagtanwala Grain Mandi',
        city: 'Amritsar',
        district: 'Amritsar',
        coords: { x: 30, y: 32 },
        basePrice: 2680,
        arrivalVol: '540 MT',
        distance: '1,190 km',
        trend: 'up',
        change: '+ ₹130',
        isTop: false,
        specialty: 'Premium 1121 Basmati Rice'
      },
      {
        id: 'bathinda',
        name: 'Bathinda Cotton & Wheat APMC',
        city: 'Bathinda',
        district: 'Bathinda',
        coords: { x: 34, y: 68 },
        basePrice: 2640,
        arrivalVol: '490 MT',
        distance: '1,040 km',
        trend: 'up',
        change: '+ ₹90',
        isTop: false,
        specialty: 'American Bt Cotton & Wheat'
      },
      {
        id: 'jalandhar',
        name: 'Jalandhar Maqsudan Mandi',
        city: 'Jalandhar',
        district: 'Jalandhar',
        coords: { x: 42, y: 38 },
        basePrice: 2590,
        arrivalVol: '420 MT',
        distance: '1,150 km',
        trend: 'down',
        change: '- ₹40',
        isTop: false,
        specialty: 'Seed Potatoes & Green Peas'
      }
    ]
  },

  MadhyaPradesh: {
    id: 'MadhyaPradesh',
    name: 'Madhya Pradesh',
    label: 'मध्य प्रदेश (Madhya Pradesh)',
    capital: 'Bhopal',
    primaryCrops: ['Soybean', 'Wheat', 'Gram (Chana)', 'Garlic', 'Mustard'],
    viewBox: '0 0 520 380',
    svgPath: `
      M 90 140
      C 150 90, 240 60, 310 70
      C 370 75, 430 110, 460 160
      C 470 210, 440 270, 390 300
      C 330 330, 250 320, 170 300
      C 110 270, 80 200, 90 140 Z
    `,
    mandis: [
      {
        id: 'indore',
        name: 'Indore APMC Chhavani Yard',
        city: 'Indore',
        district: 'Indore',
        coords: { x: 30, y: 55 },
        basePrice: 2790,
        arrivalVol: '680 MT',
        distance: '510 km',
        trend: 'up',
        change: '+ ₹210',
        isTop: true,
        specialty: 'Malwa Sharbati Wheat & Yellow Soybean'
      },
      {
        id: 'bhopal',
        name: 'Bhopal Karond Krishi Upaj Mandi',
        city: 'Bhopal',
        district: 'Bhopal',
        coords: { x: 45, y: 48 },
        basePrice: 2650,
        arrivalVol: '410 MT',
        distance: '590 km',
        trend: 'up',
        change: '+ ₹105',
        isTop: false,
        specialty: 'Gram (Chana) & Wheat'
      },
      {
        id: 'ujjain',
        name: 'Ujjain APMC Chimanganj Mandi',
        city: 'Ujjain',
        district: 'Ujjain',
        coords: { x: 28, y: 45 },
        basePrice: 2620,
        arrivalVol: '450 MT',
        distance: '480 km',
        trend: 'up',
        change: '+ ₹80',
        isTop: false,
        specialty: 'Soybean & Garlic (Lehsun)'
      }
    ]
  },

  Rajasthan: {
    id: 'Rajasthan',
    name: 'Rajasthan',
    label: 'राजस्थान (Rajasthan)',
    capital: 'Jaipur',
    primaryCrops: ['Mustard', 'Bajra', 'Guar Gum', 'Coriander', 'Wheat'],
    viewBox: '0 0 520 380',
    svgPath: `
      M 190 40
      C 270 50, 360 90, 410 140
      C 430 200, 390 270, 340 320
      C 280 340, 200 320, 140 280
      C 80 230, 70 160, 90 110
      C 120 70, 150 50, 190 40 Z
    `,
    mandis: [
      {
        id: 'kota',
        name: 'Kota Bhamashah Krishi Upaj Mandi',
        city: 'Kota',
        district: 'Kota',
        coords: { x: 62, y: 68 },
        basePrice: 2810,
        arrivalVol: '640 MT',
        distance: '620 km',
        trend: 'up',
        change: '+ ₹190',
        isTop: true,
        specialty: 'Yellow Mustard, Soybean & Coriander'
      },
      {
        id: 'jaipur',
        name: 'Jaipur Muhana Mandi Terminal',
        city: 'Jaipur',
        district: 'Jaipur',
        coords: { x: 58, y: 44 },
        basePrice: 2670,
        arrivalVol: '510 MT',
        distance: '650 km',
        trend: 'up',
        change: '+ ₹110',
        isTop: false,
        specialty: 'Wheat, Barley & Tomato'
      },
      {
        id: 'jodhpur',
        name: 'Jodhpur APMC Basni Mandi',
        city: 'Jodhpur',
        district: 'Jodhpur',
        coords: { x: 32, y: 52 },
        basePrice: 2580,
        arrivalVol: '360 MT',
        distance: '490 km',
        trend: 'down',
        change: '- ₹50',
        isTop: false,
        specialty: 'Guar Gum, Cumin & Bajra'
      }
    ]
  }
};
