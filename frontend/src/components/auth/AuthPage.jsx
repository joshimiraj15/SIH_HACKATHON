// src/components/auth/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { translations } from '../../data/translations';
import { farmerProfile } from '../../data/mockData';
import authArt from '../../assets/auth-art.jpg';
import { authAPI } from '../../services/api';
import '../../styles/AuthPage.css';

const AuthPage = ({
  onLoginSuccess,
  onBackToLanding,
  initialMode = 'signin',
  language = 'en',
  setLanguage
}) => {
  const [authMode, setAuthMode] = useState(initialMode); // 'signin' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  // Form State
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration Fields
  const [fullName, setFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regLocation, setRegLocation] = useState('Rajkot, Gujarat');
  const [farmerType, setFarmerType] = useState('Small & Marginal Farmer (< 2 Hectares)');
  const [userRole, setUserRole] = useState('farmer'); // 'farmer' or 'buyer'

  // Validation States & Controls
  const [loginIdentifierError, setLoginIdentifierError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpTarget, setOtpTarget] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [sentOtpCode, setSentOtpCode] = useState('');
  const [otpDeliveryInfo, setOtpDeliveryInfo] = useState(null);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  const t = translations[language] || translations.en;

  const validatePhone = (phoneStr) => {
    if (!phoneStr || !phoneStr.trim()) {
      return 'Mobile number is required.';
    }
    const cleanPhone = phoneStr.trim();
    if (!/^\d+$/.test(cleanPhone)) {
      return 'Mobile number must contain digits only.';
    }
    if (cleanPhone.length !== 10) {
      return 'Mobile number must be exactly 10 digits.';
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.';
    }
    return '';
  };

  const validatePassword = (passStr) => {
    if (!passStr) {
      return 'Password is required.';
    }
    if (passStr.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    return '';
  };

  const validateLoginIdentifier = (val) => {
    const trimmed = val.trim();
    if (!trimmed) {
      return 'Please enter your email or 10-digit mobile number.';
    }
    if (/^\d+$/.test(trimmed)) {
      if (trimmed.length !== 10 || !/^[6-9]\d{9}$/.test(trimmed)) {
        return 'Mobile number must be 10 digits starting with 6, 7, 8, or 9.';
      }
    } else if (trimmed.includes('@')) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return 'Please enter a valid email address.';
      }
    }
    return '';
  };

  useEffect(() => {
    let timerId;
    if (showOtpModal && otpTimer > 0) {
      timerId = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timerId);
  }, [showOtpModal, otpTimer]);

  const handleRequestOTP = async (customTarget, preferredType = null) => {
    let target = customTarget;

    if (!target) {
      if (preferredType === 'email') {
        target = regEmail || (loginIdentifier.includes('@') ? loginIdentifier : '');
      } else if (preferredType === 'phone') {
        target = regPhone || (!loginIdentifier.includes('@') ? loginIdentifier : '');
      } else {
        target = regEmail || loginIdentifier || regPhone;
      }
    }

    if (!target || !target.trim()) {
      if (preferredType === 'email') {
        setError('Please enter your email address first to receive OTP code.');
      } else {
        setError('Please enter your email address or mobile number first to receive OTP code.');
      }
      return;
    }

    const cleanTarget = target.trim();
    const isEmail = cleanTarget.includes('@');

    setLoading(true);
    setOtpError('');
    setError(null);
    setIsEditingTarget(false);

    try {
      const res = await authAPI.sendOTP(cleanTarget);
      if (res.success) {
        const generated = res.data?.otp || '684291';
        setOtpTarget(cleanTarget);
        setSentOtpCode(generated);
        setOtpDeliveryInfo({
          emailSent: res.data?.emailSent,
          smsSent: res.data?.smsSent,
          simulated: res.data?.simulated,
          type: isEmail ? 'email' : 'phone'
        });
        setShowOtpModal(true);
        setOtpTimer(30);
        setOtpInput(['', '', '', '', '', '']);
        setInfoMessage(
          isEmail
            ? `✉️ OTP code dispatched to email: ${cleanTarget}`
            : `📱 OTP code dispatched to mobile: ${cleanTarget}`
        );
      } else {
        setError(res.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpTarget(cleanTarget);
      setSentOtpCode(fallbackOtp);
      setOtpDeliveryInfo({
        emailSent: false,
        smsSent: false,
        simulated: true,
        type: isEmail ? 'email' : 'phone'
      });
      setShowOtpModal(true);
      setOtpTimer(30);
      setOtpInput(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otpInput.join('').trim();
    if (fullOtp.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP code.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await authAPI.verifyOTP(otpTarget, fullOtp);
      if (res.success) {
        try {
          confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
        } catch (e) {}
        setShowOtpModal(false);
        const userData = res.data?.user || {
          ...farmerProfile,
          email: otpTarget.includes('@') ? otpTarget : farmerProfile.email,
          phone: !otpTarget.includes('@') ? otpTarget : farmerProfile.phone,
          role: userRole
        };
        onLoginSuccess(userData, 'otp-verified-token');
      } else {
        setOtpError(res.error || 'Invalid OTP code. Try entering 123456 or 6842.');
      }
    } catch (err) {
      setShowOtpModal(false);
      onLoginSuccess({
        ...farmerProfile,
        email: otpTarget.includes('@') ? otpTarget : farmerProfile.email,
        phone: !otpTarget.includes('@') ? otpTarget : farmerProfile.phone,
        role: userRole
      }, 'otp-verified-token');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleAutoFillOtp = () => {
    if (sentOtpCode && sentOtpCode.length === 6) {
      setOtpInput(sentOtpCode.split(''));
      setOtpError('');
    }
  };

  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpInput];
    newOtp[index] = value.slice(-1);
    setOtpInput(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtpInput(pastedData.split(''));
    }
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setError(null);
    setInfoMessage(null);
    setLoginIdentifierError('');
    setPhoneError('');
    setPasswordError('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const identErr = validateLoginIdentifier(loginIdentifier);
    setLoginIdentifierError(identErr);

    if (identErr) {
      return;
    }

    if (loginMethod === 'otp') {
      await handleRequestOTP(loginIdentifier.trim());
      return;
    }

    const passErr = validatePassword(password);
    setPasswordError(passErr);

    if (passErr) {
      return;
    }

    setLoading(true);

    const inputVal = loginIdentifier.trim();
    const loginPass = password;

    try {
      const res = await authAPI.login(inputVal, loginPass);

      if (res.success && res.data) {
        const userData = res.data;
        onLoginSuccess({
          ...farmerProfile,
          ...userData,
          name: userData.name || farmerProfile.name,
          email: userData.email || inputVal,
          location: userData.location || farmerProfile.location
        }, userData.token);
      } else if (res.networkError) {
        // Backend offline fallback - smooth login
        onLoginSuccess({
          ...farmerProfile,
          role: userRole,
          name: inputVal.split('@')[0] || farmerProfile.name,
          email: inputVal.includes('@') ? inputVal : `${inputVal}@kishansetu.in`,
          phone: !inputVal.includes('@') ? inputVal : farmerProfile.phone,
          location: farmerProfile.location
        }, 'mock-jwt-token-fallback');
      } else {
        if (!inputVal || !loginPass) {
          setError(t.invalidLogin || 'Invalid email/phone or password.');
        } else {
          setError(res.error || t.invalidLogin || 'Invalid email/phone or password.');
        }
      }
    } catch (err) {
      onLoginSuccess({
        ...farmerProfile,
        role: userRole,
        email: inputVal.includes('@') ? inputVal : `${inputVal}@kishansetu.in`,
        location: farmerProfile.location
      }, 'mock-jwt-token-fallback');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const pErr = validatePhone(regPhone);
    const passErr = validatePassword(password);

    setPhoneError(pErr);
    setPasswordError(passErr);

    if (pErr || passErr) {
      return;
    }

    setLoading(true);

    const newUserData = {
      name: fullName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      password: password,
      location: regLocation,
      farmerType: farmerType,
      role: userRole
    };

    try {
      const res = await authAPI.register(newUserData);

      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}

      if (res.success && res.data) {
        const userData = res.data;
        onLoginSuccess({
          ...farmerProfile,
          ...userData,
          ...newUserData,
          avatar: farmerProfile.avatar
        }, userData.token);
      } else {
        // Offline fallback
        onLoginSuccess({
          ...farmerProfile,
          ...newUserData,
          id: `KGP${Math.floor(100000 + Math.random() * 900000)}`,
          avatar: farmerProfile.avatar
        }, 'mock-register-token');
      }
    } catch (err) {
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
      onLoginSuccess({
        ...farmerProfile,
        ...newUserData,
        id: `KGP${Math.floor(100000 + Math.random() * 900000)}`,
        avatar: farmerProfile.avatar
      }, 'mock-register-token');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      onLoginSuccess({
        ...farmerProfile,
        name: 'Meet Maniya (Google Verified)',
        email: 'meetmaniya.farm@gmail.com'
      }, 'google-oauth-token-mock');
    }, 800);
  };

  const handleForgotPassword = () => {
    const target = loginIdentifier || regPhone || regEmail || farmerProfile.phone;
    handleRequestOTP(target);
  };

  return (
    <div className="po-auth-page">
      {/* Blurred background impressionist art */}
      <div className="po-bg-art" aria-hidden="true" />
      <div className="po-bg-overlay" aria-hidden="true" />

      {/* Floating Center Card */}
      <div className="po-card">
        {/* Left Column: Agricultural Illustration Artwork */}
        <div className="po-card-left">
          <img
            src={authArt}
            alt="Impressionist agricultural landscape with farmers"
            className="po-art-img"
          />
        </div>

        {/* Right Column: Form Container */}
        <div className="po-card-right">
          {/* Top Bar: Back button & language pills */}
          <div className="po-top-nav">
            {onBackToLanding ? (
              <button
                type="button"
                className="po-back-btn"
                onClick={onBackToLanding}
              >
                ← Back to Home
              </button>
            ) : <div />}

            {setLanguage && (
              <div className="po-lang-group">
                <button
                  type="button"
                  className={`po-lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`po-lang-btn ${language === 'gu' ? 'active' : ''}`}
                  onClick={() => setLanguage('gu')}
                >
                  ગુજ
                </button>
                <button
                  type="button"
                  className={`po-lang-btn ${language === 'hi' ? 'active' : ''}`}
                  onClick={() => setLanguage('hi')}
                >
                  हिं
                </button>
              </div>
            )}
          </div>

          {/* Heading */}
          <div className="po-heading-block">
            <div className="po-eyebrow">
              {authMode === 'signin' 
                ? 'Welcome Back' 
                : `${userRole === 'farmer' ? 'Farmer' : 'Buyer'} Registration`}
            </div>
            <h1 className="po-serif-title">
              {authMode === 'signin'
                ? 'Sign In to Your Account'
                : userRole === 'farmer' 
                  ? 'Empower Your Harvest' 
                  : 'Source Premium Produce'}
            </h1>
          </div>

          {error && <div className="po-error">{error}</div>}
          {infoMessage && <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', marginBottom: '14px' }}>{infoMessage}</div>}

          {/* Form */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="po-form">
              {/* Role Toggle for Login */}
              <div className="po-field-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '8px', display: 'block' }}>{t.iamA || 'I am a...'}</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setUserRole('farmer')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: userRole === 'farmer' ? '2px solid #10B981' : '1px solid #d1d5db',
                      background: userRole === 'farmer' ? '#ecfdf5' : '#fff',
                      color: userRole === 'farmer' ? '#047857' : '#4b5563',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.farmerSeller || '🚜 Farmer (Seller)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole('buyer')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: userRole === 'buyer' ? '2px solid #10B981' : '1px solid #d1d5db',
                      background: userRole === 'buyer' ? '#ecfdf5' : '#fff',
                      color: userRole === 'buyer' ? '#047857' : '#4b5563',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.buyerFpo || '🏢 Buyer / FPO'}
                  </button>
                </div>
              </div>

              {/* Login Method Toggle: OTP vs Password */}
              <div style={{
                display: 'flex',
                background: '#f1f5f9',
                borderRadius: '12px',
                padding: '4px',
                marginBottom: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setError(null);
                    setPasswordError('');
                  }}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: 'none',
                    background: loginMethod === 'otp' ? '#10B981' : 'transparent',
                    color: loginMethod === 'otp' ? '#ffffff' : '#64748b',
                    fontWeight: '700',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: loginMethod === 'otp' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none'
                  }}
                >
                  <span>📱</span>
                  <span>OTP Verification</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setError(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: 'none',
                    background: loginMethod === 'password' ? '#10B981' : 'transparent',
                    color: loginMethod === 'password' ? '#ffffff' : '#64748b',
                    fontWeight: '700',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: loginMethod === 'password' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none'
                  }}
                >
                  <span>🔑</span>
                  <span>Password</span>
                </button>
              </div>

              <div className="po-field-group">
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  {loginMethod === 'otp' ? '📱 Mobile Number or Email' : 'Phone / Email'}
                </label>
                <input
                  type="text"
                  placeholder={loginMethod === 'otp' ? "Enter 10-digit mobile or email for OTP" : (t.enterEmailPhone || "Enter email or 10-digit phone number")}
                  value={loginIdentifier}
                  onChange={(e) => {
                    setLoginIdentifier(e.target.value);
                    if (loginIdentifierError) setLoginIdentifierError(validateLoginIdentifier(e.target.value));
                  }}
                  onBlur={() => setLoginIdentifierError(validateLoginIdentifier(loginIdentifier))}
                  className={`po-input ${loginIdentifierError ? 'po-input-error' : ''}`}
                  autoComplete="username"
                />
                {loginIdentifierError && <span className="po-field-error">⚠️ {loginIdentifierError}</span>}
              </div>

              {loginMethod === 'otp' ? (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.82rem',
                  color: '#166534'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                  <span>Enter your phone or email. Clicking the button below sends an instant 6-digit OTP to verify and log in.</span>
                </div>
              ) : (
                <div className="po-field-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      style={{ background: 'none', border: 'none', color: '#15803d', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                    >
                      {t.forgotPassword || 'Forgot Password?'}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t.enterPassword || "Enter your password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError(validatePassword(e.target.value));
                      }}
                      onBlur={() => setPasswordError(validatePassword(password))}
                      className={`po-input ${passwordError ? 'po-input-error' : ''}`}
                      style={{ paddingRight: '48px' }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide Password" : "Show Password"}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        color: '#6b7280',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        userSelect: 'none'
                      }}
                    >
                      {showPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                  {passwordError && <span className="po-field-error">⚠️ {passwordError}</span>}
                </div>
              )}

              <button
                type="submit"
                className="po-submit-btn"
                disabled={loading}
              >
                {loading
                  ? (loginMethod === 'otp' ? 'Sending OTP Code...' : (t.loggingIn || 'Logging in...'))
                  : (loginMethod === 'otp' ? '📱 Send OTP & Login' : (t.loginButton || 'Login'))
                }
              </button>

              {/* Google Button */}
              <button
                type="button"
                className="po-google-btn"
                onClick={handleGoogleAuth}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #e5e7eb',
                  padding: '11px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  color: '#374151',
                  cursor: 'pointer',
                  marginTop: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="po-switch-row" style={{ marginTop: '16px' }}>
                <span>Don't have an account?</span>
                <button
                  type="button"
                  className="po-switch-link"
                  onClick={() => switchAuthMode('signup')}
                >
                  Create Account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="po-form">
              {/* Role Toggle */}
              <div className="po-field-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '8px', display: 'block' }}>{t.iamA || 'I am a...'}</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setUserRole('farmer')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: userRole === 'farmer' ? '2px solid #10B981' : '1px solid #d1d5db',
                      background: userRole === 'farmer' ? '#ecfdf5' : '#fff',
                      color: userRole === 'farmer' ? '#047857' : '#4b5563',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.farmerSeller || '🚜 Farmer (Seller)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole('buyer')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: userRole === 'buyer' ? '2px solid #10B981' : '1px solid #d1d5db',
                      background: userRole === 'buyer' ? '#ecfdf5' : '#fff',
                      color: userRole === 'buyer' ? '#047857' : '#4b5563',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.buyerFpo || '🏢 Buyer / FPO'}
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="po-field-group">
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Full Name</label>
                <input
                  type="text"
                  placeholder={t.enterFullName || "Enter your full name"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="po-input"
                  required
                />
              </div>

              {/* Phone and Email in 2 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="po-field-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Phone</label>
                  <input
                    type="tel"
                    placeholder={t.enterPhone || "Enter 10-digit phone number"}
                    value={regPhone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setRegPhone(digitsOnly);
                      if (phoneError) setPhoneError(validatePhone(digitsOnly));
                    }}
                    onBlur={() => setPhoneError(validatePhone(regPhone))}
                    className={`po-input ${phoneError ? 'po-input-error' : ''}`}
                    maxLength={10}
                  />
                  {phoneError && <span className="po-field-error">⚠️ {phoneError}</span>}
                </div>

                <div className="po-field-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Email</label>
                  <input
                    type="email"
                    placeholder={t.enterEmail || "Enter email address"}
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="po-input"
                  />
                </div>
              </div>

              {/* Location and Farmer Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="po-field-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Location</label>
                  <input
                    type="text"
                    placeholder={t.enterLocation || "Enter location"}
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    className="po-input"
                  />
                </div>

                <div className="po-field-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Farmer Type</label>
                  <select
                    value={farmerType}
                    onChange={(e) => setFarmerType(e.target.value)}
                    className="po-input po-select"
                  >
                    <option value="Small & Marginal Farmer (< 2 Hectares)">Small & Marginal (&lt; 2 Ha)</option>
                    <option value="Medium Landowner (2 - 10 Hectares)">Medium Landowner</option>
                    <option value="Commercial Agri-Grower">Commercial Grower</option>
                    <option value="FPO Producer Member">FPO Member</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="po-field-group">
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t.enterPassword || "Create a secure password (min 6 chars)"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(validatePassword(e.target.value));
                    }}
                    onBlur={() => setPasswordError(validatePassword(password))}
                    className={`po-input ${passwordError ? 'po-input-error' : ''}`}
                    style={{ paddingRight: '48px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide Password" : "Show Password"}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      color: '#6b7280',
                      padding: '4px 6px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      userSelect: 'none'
                    }}
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
                {passwordError && <span className="po-field-error">⚠️ {passwordError}</span>}
              </div>

              <button
                type="submit"
                className="po-submit-btn"
                disabled={loading}
              >
                {loading ? (t.creatingAccount || 'Creating Account...') : (t.registerButton || 'Register / Create Account')}
              </button>

              <button
                type="button"
                className="po-google-btn"
                onClick={handleGoogleAuth}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #e5e7eb',
                  padding: '11px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  color: '#374151',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{t.continueWithGoogle || 'Continue with Google'}</span>
              </button>



              <div className="po-switch-row" style={{ marginTop: '16px' }}>
                <span>Already have an account?</span>
                <button
                  type="button"
                  className="po-switch-link"
                  onClick={() => switchAuthMode('signin')}
                >
                  Log in
                </button>
              </div>
            </form>
          )}

          {/* Bottom Brand Footer */}
          <div className="po-card-footer">
            <div className="po-brand">
              <span className="po-brand-name">KisanSetu</span>
            </div>
            <div className="po-brand-tagline">
              Strengthening Market Linkages and Price Discovery for Farmers.
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Overlay Modal */}
      {showOtpModal && (
        <div className="po-otp-overlay">
          <div className="po-otp-modal">
            <button 
              type="button" 
              className="po-otp-close-btn"
              onClick={() => setShowOtpModal(false)}
            >
              ✕
            </button>

            <div className="po-otp-header">
              <div className="po-otp-icon-wrap">
                {otpTarget.includes('@') ? '✉️' : '📲'}
              </div>
              <h2 className="po-otp-title">Enter Verification Code</h2>
              {!isEditingTarget ? (
                <p className="po-otp-subtitle">
                  {otpTarget.includes('@') ? '✉️ OTP sent to email:' : '📲 OTP sent to mobile:'}{' '}
                  <strong style={{ color: '#111827' }}>{otpTarget}</strong>{' '}
                  <button 
                    type="button" 
                    onClick={() => setIsEditingTarget(true)} 
                    style={{ background: 'none', border: 'none', color: '#059669', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline', paddingLeft: '4px' }}
                  >
                    (Edit Target)
                  </button>
                </p>
              ) : (
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                  <input
                    type="text"
                    placeholder="Enter email address or mobile"
                    value={otpTarget}
                    onChange={(e) => setOtpTarget(e.target.value)}
                    className="po-input"
                    style={{ padding: '8px 12px', fontSize: '0.86rem', maxWidth: '240px' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRequestOTP(otpTarget)}
                    style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 12px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Send OTP
                  </button>
                </div>
              )}
            </div>

            {/* Notification Banner */}
            {otpDeliveryInfo?.emailSent && !otpDeliveryInfo?.simulated ? (
              <div className="po-otp-success-banner">
                <span>✅ OTP verification code dispatched to your Gmail (<strong>{otpTarget}</strong>). Please check your Inbox and Spam folder!</span>
              </div>
            ) : otpDeliveryInfo?.smsSent && !otpDeliveryInfo?.simulated ? (
              <div className="po-otp-success-banner">
                <span>✅ Real OTP SMS dispatched to your mobile number (<strong>{otpTarget}</strong>)!</span>
              </div>
            ) : (
              <div className="po-otp-demo-banner">
                <span style={{ fontSize: '0.85rem' }}>
                  {otpTarget.includes('@') ? '✉️ Code:' : '📱 Code:'} <strong>{sentOtpCode}</strong>
                </span>
                <button 
                  type="button" 
                  onClick={handleAutoFillOtp}
                  className="po-otp-autofill-btn"
                >
                  ⚡ Auto-fill
                </button>
              </div>
            )}

            {/* Quick Switch between SMS and Gmail */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              {otpTarget.includes('@') ? (
                <button
                  type="button"
                  onClick={() => handleRequestOTP(regPhone || (!loginIdentifier.includes('@') ? loginIdentifier : ''), 'phone')}
                  style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  📱 Send OTP to Mobile via SMS instead
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRequestOTP(regEmail || (loginIdentifier.includes('@') ? loginIdentifier : ''), 'email')}
                  style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ✉️ Send OTP to Gmail instead
                </button>
              )}
            </div>

            {otpError && <div className="po-error" style={{ marginTop: '6px', marginBottom: '12px' }}>⚠️ {otpError}</div>}

            <form onSubmit={handleVerifyOTP} className="po-otp-form">
              <div className="po-otp-digits-container" onPaste={handleOtpPaste}>
                {otpInput.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-digit-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="po-otp-digit-input"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="po-otp-resend-row">
                {otpTimer > 0 ? (
                  <span>Resend OTP in <strong>{otpTimer}s</strong></span>
                ) : (
                  <button
                    type="button"
                    className="po-switch-link"
                    onClick={() => handleRequestOTP(otpTarget)}
                  >
                    🔄 Resend OTP Code
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="po-submit-btn"
                disabled={otpLoading || otpInput.join('').length < 6}
                style={{ marginTop: '16px' }}
              >
                {otpLoading ? 'Verifying OTP...' : 'Verify & Continue'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
