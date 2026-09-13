const nodemailer = require('nodemailer');

/**
 * Send Email Utility for KisanSetu OTP & Notifications
 * @param {Object} options - { email, subject, message, html, otp }
 */
const sendEmail = async (options) => {
  let transporter;

  // 1. Check if SMTP credentials exist in environment variables
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // 2. Fallback to Ethereal / Direct Nodemailer test transporter for instant testing
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } catch (e) {
      // 3. Fallback to JSON transport
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }
  }

  // Beautiful HTML Email Template for KisanSetu
  const defaultHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #FAF8F5; border-radius: 16px; border: 1px solid #EFECE6;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ECFDF5;">
        <h1 style="color: #047857; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">🌾 KisanSetu</h1>
        <p style="color: #6B7280; font-size: 13px; margin-top: 4px;">Direct Mandis. Better Returns.</p>
      </div>

      <div style="padding: 24px 8px; text-align: center;">
        <h2 style="color: #111827; font-size: 20px; margin-bottom: 12px;">OTP Verification Code</h2>
        <p style="color: #374151; font-size: 14.5px; line-height: 1.5; margin-bottom: 24px;">
          Namaste! Use the following 6-digit verification code to complete your login / registration on <strong>KisanSetu</strong>.
        </p>

        <div style="background: #ECFDF5; border: 2px dashed #059669; border-radius: 12px; padding: 18px 24px; display: inline-block; margin-bottom: 24px;">
          <span style="font-family: monospace; font-size: 36px; font-weight: 800; color: #047857; letter-spacing: 8px;">
            ${options.otp || '680323'}
          </span>
        </div>

        <p style="color: #6B7280; font-size: 13px; line-height: 1.5;">
          This code is valid for <strong>5 minutes</strong>.<br />
          If you did not request this OTP code, please ignore this email.
        </p>
      </div>

      <div style="text-align: center; padding-top: 18px; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px;">
        <p style="margin: 0;">© 2026 KisanSetu. Strengthening Market Linkages & Price Discovery.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"KisanSetu Support" <${process.env.EMAIL_FROM || 'noreply@kishansetu.in'}>`,
    to: options.email,
    subject: options.subject || '🌾 KisanSetu OTP Verification Code',
    text: options.message || `Your KisanSetu OTP is: ${options.otp}`,
    html: options.html || defaultHtml
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL DISPATCH SUCCESS] Target: ${options.email} | MessageId: ${info.messageId}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[EMAIL PREVIEW URL] ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, info };
  } catch (error) {
    console.error(`[EMAIL DISPATCH ERROR] Target: ${options.email} | Error:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
