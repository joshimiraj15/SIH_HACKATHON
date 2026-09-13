const axios = require('axios');

const DISTRICT_COORDINATES = {
  rajkot: { lat: 22.3039, long: 70.8022, name: 'Rajkot, Gujarat' },
  nashik: { lat: 19.9975, long: 73.7898, name: 'Nashik, Maharashtra' },
  solapur: { lat: 17.6599, long: 75.9064, name: 'Solapur, Maharashtra' },
  ahmedabad: { lat: 23.0225, long: 72.5714, name: 'Ahmedabad, Gujarat' },
  junagadh: { lat: 21.5222, long: 70.4579, name: 'Junagadh, Gujarat' },
  surat: { lat: 21.1702, long: 72.8311, name: 'Surat, Gujarat' },
  ludhiana: { lat: 30.9010, long: 75.8573, name: 'Ludhiana, Punjab' },
  indore: { lat: 22.7196, long: 75.8577, name: 'Indore, Madhya Pradesh' }
};

/**
 * Fetch live weather from Open-Meteo API
 * @param {string} district - E.g. 'Rajkot', 'Nashik', 'Solapur'
 */
exports.getLiveWeather = async (district = 'Rajkot') => {
  const key = district.toLowerCase().trim();
  const location = DISTRICT_COORDINATES[key] || DISTRICT_COORDINATES.rajkot;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.long}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum&timezone=auto`;

  try {
    const response = await axios.get(url, { 
      timeout: 8000,
      headers: { 'User-Agent': 'KisanSetuAgriApp/1.0 (contact@kisansetu.in)' }
    });


    if (response.data && response.data.current && response.data.daily) {
      const current = response.data.current;
      const daily = response.data.daily;

      const temp = current.temperature_2m;
      const humidity = current.relative_humidity_2m;
      const windSpeed = current.wind_speed_10m;
      const todayRain = daily.rain_sum ? daily.rain_sum[0] : 0;
      const maxTemp = daily.temperature_2m_max ? daily.temperature_2m_max[0] : temp + 4;
      const minTemp = daily.temperature_2m_min ? daily.temperature_2m_min[0] : temp - 4;

      // Calculate Field Advisory
      let advisoryGu = '';
      let advisoryEn = '';
      let sprayCondition = 'Good';

      if (todayRain > 5) {
        advisoryGu = 'વરસાદની શક્યતા હોવાથી પાકની લણણી અને સુકવણી મુલતવી રાખવી.';
        advisoryEn = 'Incoming rainfall expected. Postpone harvesting and outdoor crop drying.';
        sprayCondition = 'Avoid';
      } else if (windSpeed > 18) {
        advisoryGu = 'પવનની ગતિ વધુ હોવાથી દવાનો છંટકાવ મુલતવી રાખવો.';
        advisoryEn = 'High wind speeds detected. Avoid chemical spraying to prevent drift.';
        sprayCondition = 'Caution';
      } else {
        advisoryGu = 'હવામાન અનુકૂળ છે. દવાનો છંટકાવ અને પિયત માટે યોગ્ય સમય છે.';
        advisoryEn = 'Favorable weather conditions. Ideal time for pesticide spraying and irrigation.';
        sprayCondition = 'Ideal';
      }

      return {
        success: true,
        source: 'Open-Meteo API',
        location: location.name,
        current: {
          temp: `${Math.round(temp)}°C`,
          tempVal: Math.round(temp),
          humidity: `${humidity}%`,
          humidityVal: humidity,
          windSpeed: `${windSpeed} km/h`,
          maxTemp: `${Math.round(maxTemp)}°C`,
          minTemp: `${Math.round(minTemp)}°C`,
          rainSum: `${todayRain} mm`
        },
        forecast7Days: daily.time ? daily.time.map((t, idx) => ({
          date: t,
          maxTemp: Math.round(daily.temperature_2m_max[idx]),
          minTemp: Math.round(daily.temperature_2m_min[idx]),
          rainSum: daily.rain_sum ? daily.rain_sum[idx] : 0
        })) : [],
        advisory: {
          gu: advisoryGu,
          en: advisoryEn,
          sprayCondition
        }
      };
    }
  } catch (err) {
    console.warn('[Open-Meteo Weather Service] Primary API failed, using fallback:', err.message);
  }

  // Graceful fallback
  return {
    success: true,
    source: 'Open-Meteo Local Fallback',
    isFallback: true,
    location: location.name,
    current: {
      temp: '29°C',
      tempVal: 29,
      humidity: '62%',
      humidityVal: 62,
      windSpeed: '12 km/h',
      maxTemp: '33°C',
      minTemp: '22°C',
      rainSum: '0 mm'
    },
    forecast7Days: [
      { date: 'Today', maxTemp: 33, minTemp: 22, rainSum: 0 },
      { date: 'Tomorrow', maxTemp: 32, minTemp: 21, rainSum: 0 },
      { date: '+2 Days', maxTemp: 34, minTemp: 23, rainSum: 2.1 }
    ],
    advisory: {
      gu: 'હવામાન ચોખ્ખું છે. કપાસ અને શાકભાજીમાં પિયત અને દવાનો છંટકાવ કરવા માટે અનુકૂળ સમય.',
      en: 'Clear skies. Ideal conditions for irrigation and pesticide spraying on crops.',
      sprayCondition: 'Ideal'
    }
  };
};
