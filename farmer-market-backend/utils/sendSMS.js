const axios = require('axios');

/**
 * Send SMS Utility for KisanSetu OTP & Alerts
 * Supports Fast2SMS (Indian numbers) and Twilio (Global)
 * @param {Object} options - { phone, otp, message }
 */
const sendSMS = async (options) => {
  const phone = String(options.phone || '').replace(/[^0-9]/g, '');
  const otp = options.otp;
  const message = options.message || `Your KisanSetu OTP code is ${otp}. Valid for 5 minutes. Do not share this with anyone.`;

  // 1. Fast2SMS (India SMS Gateway)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const indianPhone = phone.length > 10 ? phone.slice(-10) : phone;
      const response = await axios.post(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          route: 'otp',
          variables_values: otp,
          numbers: indianPhone
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log(`[Fast2SMS SUCCESS] Phone: ${indianPhone} | Response:`, response.data);
      return { success: true, provider: 'Fast2SMS', data: response.data };
    } catch (err) {
      console.error('[Fast2SMS ERROR]:', err.response?.data || err.message);
    }
  }

  // 2. Twilio SMS
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const formattedPhone = phone.startsWith('+') ? phone : (phone.length === 10 ? `+91${phone}` : `+${phone}`);
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      
      const params = new URLSearchParams();
      params.append('To', formattedPhone);
      params.append('From', process.env.TWILIO_PHONE_NUMBER);
      params.append('Body', message);

      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        params.toString(),
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 10000
        }
      );

      console.log(`[Twilio SMS SUCCESS] Phone: ${formattedPhone} | SID: ${response.data.sid}`);
      return { success: true, provider: 'Twilio', sid: response.data.sid };
    } catch (err) {
      console.error('[Twilio SMS ERROR]:', err.response?.data || err.message);
    }
  }

  // 3. Fallback: Log to console & return success so UI can use OTP in development
  console.log(`\n========================================`);
  console.log(`[KisanSetu SMS OTP SIMULATOR]`);
  console.log(`TO: +91 ${phone}`);
  console.log(`MESSAGE: ${message}`);
  console.log(`OTP CODE: ${otp}`);
  console.log(`========================================\n`);

  return {
    success: true,
    simulated: true,
    message: 'SMS logged to server console (configure FAST2SMS_API_KEY or Twilio in .env for live SMS delivery)'
  };
};

module.exports = sendSMS;