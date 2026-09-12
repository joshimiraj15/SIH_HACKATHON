// src/components/auth/AuthPage.jsx
import React, { useState } from 'react';
import { 
  Sprout, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  TrendingUp,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../../data/translations';
import { farmerProfile } from '../../data/mockData';
import { api } from '../../services/api';
import '../../styles/AuthPage.css';

const AuthPage = ({ onLoginSuccess, language, setLanguage }) => {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDistrict, setRegDistrict] = useState('Rajkot');
  const [regLandSize, setRegLandSize] = useState('3.5');
  const [regPrimaryCrop, setRegPrimaryCrop] = useState('Wheat');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const t = translations[language] || translations.en;

  const loginAsUser = async (userEmail, userPassword, roleName) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.login(userEmail, userPassword);
      if (res.success && res.user) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
        onLoginSuccess(res.user, res.token);
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      // Fallback
      const fallbackUser = {
        ...farmerProfile,
        name: roleName === 'buyer' ? 'Priya Sharma' : roleName === 'admin' ? 'KisanSetu Admin' : 'Ramesh Patel',
        role: roleName,
        email: userEmail
      };
      onLoginSuccess(fallbackUser, 'demo-token');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = email.trim() || 'farmer@kisansetu.com';
    const loginPassword = password.trim() || 'farmer123';

    try {
      const res = await api.auth.login(loginEmail, loginPassword);
      if (res.success && res.user) {
        onLoginSuccess(res.user, res.token);
      } else {
        setError(res.message || 'Invalid credentials.');
      }
    } catch (err) {
      if (loginEmail.includes('farmer') || loginEmail.includes('meet')) {
        onLoginSuccess(farmerProfile, 'mock-jwt-token-farmer');
      } else {
        setError(err.message || 'Could not connect to server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role = 'farmer') => {
    if (role === 'buyer') {
      loginAsUser('buyer@kisansetu.com', 'buyer123', 'buyer');
    } else if (role === 'admin') {
      loginAsUser('admin@kisansetu.com', 'admin123', 'admin');
    } else {
      loginAsUser('farmer@kisansetu.com', 'farmer123', 'farmer');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const newUserData = {
      name: regName.trim(),
      email: regEmail.trim(),
      mobile: regMobile.trim(),
      password: regPassword,
      district: regDistrict,
      state: 'Gujarat',
      landSize: `${regLandSize} Acres`,
      primaryCrops: [regPrimaryCrop],
      location: `${regDistrict}, Gujarat`,
      role: 'farmer'
    };

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData)
      });
      const data = await res.json();

      if (data.success && data.user) {
        try {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
        } catch (e) {}
        onLoginSuccess({
          ...farmerProfile,
          ...data.user,
          avatar: farmerProfile.avatar
        }, data.token);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      // Fallback
      onLoginSuccess({
        ...farmerProfile,
        ...newUserData,
        id: `KGP${Math.floor(100000 + Math.random() * 900000)}`,
        avatar: farmerProfile.avatar
      }, 'mock-register-token');
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-bg-glow-1" />
      <div className="auth-bg-glow-2" />

      <div className="auth-card-layout">
        {/* Left Promo Branding */}
        <div className="auth-left-promo">
          <div className="promo-top-brand">
            <div className="promo-brand-icon">
              <Sprout size={24} strokeWidth={2.4} />
            </div>
            <div className="promo-brand-text">
              <h2>Kisan<span>Setu</span></h2>
              <p>{t.tagline}</p>
            </div>
          </div>

          <div className="promo-hero-message">
            <h1>
              Direct Mandis.<br />
              <span>Better Returns.</span>
            </h1>
            <p>
              Connect directly with Saurashtra & Gujarat APMC yards, verified institutional buyers, and AI price intelligence.
            </p>

            <div className="promo-points-list">
              <div className="promo-point-item">
                <div className="promo-point-icon"><ShieldCheck size={14} /></div>
                <span>Zero Broker Commission Deduction</span>
              </div>
              <div className="promo-point-item">
                <div className="promo-point-icon"><TrendingUp size={14} /></div>
                <span>Real-Time Gujarat APMC Live Rates</span>
              </div>
              <div className="promo-point-item">
                <div className="promo-point-icon"><Sparkles size={14} /></div>
                <span>AI Crop Price Forecasts & Weather Alerts</span>
              </div>
            </div>
          </div>

          {/* Farmer Testimony */}
          <div className="promo-farmer-testimony">
            <img 
              src={farmerProfile.avatar} 
              alt="Farmer Meet Maniya" 
              className="testimony-avatar" 
            />
            <div>
              <div className="testimony-name">Meet Maniya</div>
              <div className="testimony-role">Wheat & Tomato Farmer, Rajkot (3.5 Acres)</div>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-right-form-panel">
          <div>
            {/* Header Top: Language Selector */}
            <div className="auth-header-top">
              <div className="auth-lang-selector">
                <button 
                  className={`lang-tab ${language === 'en' ? 'active' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  English
                </button>
                <button 
                  className={`lang-tab ${language === 'gu' ? 'active' : ''}`}
                  onClick={() => setLanguage('gu')}
                >
                  ગુજરાતી
                </button>
                <button 
                  className={`lang-tab ${language === 'hi' ? 'active' : ''}`}
                  onClick={() => setLanguage('hi')}
                >
                  हिंदी
                </button>
              </div>
            </div>

            {/* Switch Tabs: Sign In / Register */}
            <div className="auth-mode-tabs">
              <button 
                className={`auth-tab-btn ${authMode === 'signin' ? 'active' : ''}`}
                onClick={() => { setAuthMode('signin'); setError(null); }}
              >
                {t.signIn}
              </button>
              <button 
                className={`auth-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => { setAuthMode('signup'); setError(null); }}
              >
                {t.signUp}
              </button>
            </div>

            {/* Welcome title */}
            <div className="auth-welcome-text">
              <h2>{authMode === 'signin' ? t.welcomeBack : t.createAccount}</h2>
              <p>{authMode === 'signin' ? t.loginSubtitle : t.registerSubtitle}</p>
            </div>

            {error && <div className="auth-error-msg">{error}</div>}

            {/* Sign In Form */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSignIn} className="auth-form">
                <div className="auth-input-group">
                  <label>{t.emailOrMobile}</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input 
                      type="text" 
                      placeholder="e.g. meetmaniya@gmail.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>{t.password}</label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#4b5563' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)} 
                    />
                    {t.rememberMe}
                  </label>
                  <span style={{ color: '#15803d', fontWeight: '600', cursor: 'pointer' }}>
                    Forgot password?
                  </span>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  <span>{loading ? 'Authenticating...' : t.login}</span>
                  <ArrowRight size={16} />
                </button>

                <div style={{ textAlign: 'center', margin: '8px 0 6px 0', fontSize: '0.78rem', color: '#9ca3af', fontWeight: '600' }}>
                  — INSTANT 1-CLICK DEMO ROLES —
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="auth-demo-btn"
                    onClick={() => handleDemoLogin('farmer')}
                    style={{ padding: '8px 6px', flexDirection: 'column', gap: '4px', textAlign: 'center' }}
                    title="Sign in as Farmer (Ramesh Patel)"
                  >
                    <span style={{ fontSize: '1.1rem' }}>🌾</span>
                    <span style={{ fontSize: '0.74rem', fontWeight: '700' }}>Farmer</span>
                    <span style={{ fontSize: '0.62rem', color: '#15803d' }}>Ramesh Patel</span>
                  </button>

                  <button 
                    type="button" 
                    className="auth-demo-btn"
                    onClick={() => handleDemoLogin('buyer')}
                    style={{ padding: '8px 6px', flexDirection: 'column', gap: '4px', textAlign: 'center' }}
                    title="Sign in as Wholesale Buyer (Reliance Fresh)"
                  >
                    <span style={{ fontSize: '1.1rem' }}>🏢</span>
                    <span style={{ fontSize: '0.74rem', fontWeight: '700' }}>Buyer</span>
                    <span style={{ fontSize: '0.62rem', color: '#15803d' }}>Reliance Fresh</span>
                  </button>

                  <button 
                    type="button" 
                    className="auth-demo-btn"
                    onClick={() => handleDemoLogin('admin')}
                    style={{ padding: '8px 6px', flexDirection: 'column', gap: '4px', textAlign: 'center' }}
                    title="Sign in as Platform Admin"
                  >
                    <span style={{ fontSize: '1.1rem' }}>🏛️</span>
                    <span style={{ fontSize: '0.74rem', fontWeight: '700' }}>Admin</span>
                    <span style={{ fontSize: '0.62rem', color: '#15803d' }}>Super Admin</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="auth-form">
                <div className="auth-input-group">
                  <label>{t.fullName}</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-input-icon" />
                    <input 
                      type="text" 
                      placeholder="e.g. Meet Maniya" 
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="auth-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                  <div className="auth-input-group">
                    <label>{t.mobile}</label>
                    <div className="auth-input-wrapper">
                      <Phone size={16} className="auth-input-icon" />
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        className="auth-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label>{t.district}</label>
                    <select 
                      value={regDistrict} 
                      onChange={(e) => setRegDistrict(e.target.value)}
                      className="auth-input"
                      style={{ paddingLeft: '12px' }}
                    >
                      <option value="Rajkot">Rajkot</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Surat">Surat</option>
                      <option value="Junagadh">Junagadh</option>
                      <option value="Amreli">Amreli</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                  <div className="auth-input-group">
                    <label>{t.landSize}</label>
                    <input 
                      type="number" 
                      placeholder="3.5" 
                      value={regLandSize}
                      onChange={(e) => setRegLandSize(e.target.value)}
                      className="auth-input"
                      style={{ paddingLeft: '12px' }}
                      required
                    />
                  </div>

                  <div className="auth-input-group">
                    <label>{t.primaryCrop}</label>
                    <select 
                      value={regPrimaryCrop} 
                      onChange={(e) => setRegPrimaryCrop(e.target.value)}
                      className="auth-input"
                      style={{ paddingLeft: '12px' }}
                    >
                      <option value="Wheat">🌾 Wheat (ઘઉં)</option>
                      <option value="Tomato">🍅 Tomato (ટામેટા)</option>
                      <option value="Cotton">🌱 Cotton (કપાસ)</option>
                      <option value="Groundnut">🥜 Groundnut (મગફળી)</option>
                      <option value="Onion">🧅 Onion (ડુંગળી)</option>
                      <option value="Potato">🥔 Potato (બટાકા)</option>
                    </select>
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>{t.emailOrMobile}</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input 
                      type="email" 
                      placeholder="farmer@example.com" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="auth-input"
                      required
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>{t.password}</label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input 
                      type="password" 
                      placeholder="Min. 6 characters" 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="auth-input"
                      required
                    />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#4b5563', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={agreeTerms} 
                    onChange={(e) => setAgreeTerms(e.target.checked)} 
                    required 
                  />
                  {t.termsAgree}
                </label>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  <span>{loading ? 'Creating Account...' : t.signUp}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
