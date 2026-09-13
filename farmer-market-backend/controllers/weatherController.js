const { getLiveWeather } = require('../services/weatherService');

exports.getWeatherForecast = async (req, res, next) => {
  try {
    const { district = 'Rajkot' } = req.query;
    const weatherData = await getLiveWeather(district);

    res.status(200).json({
      success: true,
      message: `Retrieved Open-Meteo weather forecast for ${district}`,
      ...weatherData
    });
  } catch (error) {
    next(error);
  }
};
