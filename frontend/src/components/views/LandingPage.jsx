import React, { useEffect, useRef } from 'react';
import heroFarm from '../../assets/hero-farm-new.jpg';
import barnImg  from '../../assets/barn.jpg';
import slide1   from '../../assets/slide1.jpg';
import slide2   from '../../assets/slide2.jpg';
import slide3   from '../../assets/slide3.jpg';
import slide4   from '../../assets/slide4.jpg';
import slide5   from '../../assets/slide5.jpg';

/* ─── Inline style tokens ─────────────────────────────────── */
const T = {
  cream:    '#F5F4F0',
  charcoal: '#1A1A1A',
  green:    '#3F6B3F',
  greenLt:  '#5A8F5A',
  gray:     '#6B6B6B',
  grayLt:   '#9A9A9A',
  border:   '#DDDBD4',
};

/* ─── Global styles injected once ───────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  .fb-root * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
  .fb-root { background: ${T.cream}; color: ${T.charcoal}; overflow-x: hidden; }

  /* Scrollbar */
  .fb-root { scroll-behavior: smooth; }

  /* Guide lines */
  .fb-guide-wrap {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    display: flex; justify-content: center; gap: 540px;
  }
  .fb-guide-line {
    width: 1px;
    background: repeating-linear-gradient(
      to bottom, ${T.border} 0px, ${T.border} 6px,
      transparent 6px, transparent 14px
    );
    opacity: 0.4;
  }

  /* Sparkles */
  .fb-sparkle {
    position: absolute; pointer-events: none;
    color: ${T.charcoal}; opacity: 0.14;
    animation: fb-float 6s ease-in-out infinite;
  }
  .fb-sparkle-green { color: ${T.green}; opacity: 0.38; }
  @keyframes fb-float {
    0%,100% { transform: translateY(0) rotate(0deg) scale(1); }
    50%      { transform: translateY(-10px) rotate(12deg) scale(1.05); }
  }

  /* Pulse dot */
  @keyframes fb-pulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(63,107,63,.22); }
    50%      { box-shadow: 0 0 0 7px rgba(63,107,63,.06); }
  }
  .fb-tag-dot {
    width: 8px; height: 8px; border-radius: 50%; background: ${T.green};
    box-shadow: 0 0 0 3px rgba(63,107,63,.22);
    animation: fb-pulse 2.2s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* Reveal animation */
  .fb-reveal { opacity: 0; transform: translateY(28px); transition: opacity .72s cubic-bezier(.4,0,.2,1), transform .72s cubic-bezier(.4,0,.2,1); }
  .fb-reveal.fb-visible { opacity: 1; transform: translateY(0); }
  .fb-d1 { transition-delay: .1s; }
  .fb-d2 { transition-delay: .22s; }
  .fb-d3 { transition-delay: .34s; }

  /* Pill buttons */
  .fb-btn { display: inline-flex; align-items: center; gap: 6px; padding: 13px 30px; border-radius: 999px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .24s cubic-bezier(.4,0,.2,1); border: none; font-family: inherit; white-space: nowrap; text-decoration: none; }
  .fb-btn-dark { background: ${T.charcoal}; color: #fff; }
  .fb-btn-dark:hover { background: #333; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(26,26,26,.2); }
  .fb-btn-outline { background: transparent; color: ${T.charcoal}; border: 1.5px solid ${T.charcoal}; }
  .fb-btn-outline:hover { background: ${T.charcoal}; color: #fff; transform: translateY(-1px); }

  /* Navbar */
  .fb-nav { position: sticky; top: 0; z-index: 100; background: rgba(245,244,240,.93); backdrop-filter: blur(16px); border-bottom: 1px solid ${T.border}; }
  .fb-nav-inner { max-width: 1320px; margin: 0 auto; padding: 0 48px; display: flex; align-items: center; justify-content: space-between; height: 68px; }
  .fb-nav-logo { display: flex; align-items: center; gap: 10px; font-size: 19px; font-weight: 800; letter-spacing: -.6px; color: ${T.charcoal}; text-decoration: none; cursor: pointer; background: none; border: none; font-family: inherit; }
  .fb-nav-logo-icon { width: 32px; height: 32px; background: ${T.green}; border-radius: 8px; display: grid; place-items: center; flex-shrink: 0; }
  .fb-nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  .fb-nav-links a { font-size: 13.5px; font-weight: 500; color: ${T.gray}; text-decoration: none; transition: color .2s; cursor: pointer; }
  .fb-nav-links a:hover { color: ${T.charcoal}; }
  .fb-nav-signin { font-size: 13.5px; font-weight: 500; color: ${T.charcoal}; text-decoration: none; padding: 8px 14px; transition: color .2s; cursor: pointer; background: none; border: none; font-family: inherit; }
  .fb-nav-signin:hover { color: ${T.green}; }
  .fb-nav-actions { display: flex; gap: 10px; align-items: center; }

  /* Hero */
  #fb-hero { padding: 100px 0 60px; }
  .fb-container { max-width: 1320px; margin: 0 auto; padding: 0 48px; position: relative; z-index: 1; }
  .fb-hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .fb-hero-tag { display: inline-flex; align-items: center; gap: 9px; font-size: 11.5px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: ${T.green}; margin-bottom: 32px; }
  .fb-hero-headline { font-size: clamp(38px, 3.8vw, 64px); font-weight: 900; letter-spacing: -2.5px; line-height: 1.03; color: ${T.charcoal}; margin-bottom: 26px; }
  .fb-hero-sub { font-size: 16px; color: ${T.gray}; font-weight: 400; max-width: 430px; line-height: 1.75; margin-bottom: 44px; }

  /* Hero right image */
  .fb-hero-right { position: relative; flex-shrink: 0; }
  .fb-hero-frame { position: absolute; inset: -10px; border: 1.5px dashed ${T.border}; border-radius: 26px; pointer-events: none; z-index: -1; }
  .fb-hero-img-wrap { position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 3/4; max-height: 570px; box-shadow: 0 24px 80px rgba(26,26,26,.13); }
  .fb-hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 9s ease; }
  .fb-hero-img-wrap:hover img { transform: scale(1.04); }
  .fb-hero-badge { position: absolute; bottom: 24px; left: 24px; background: rgba(245,244,240,.96); backdrop-filter: blur(10px); border-radius: 14px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 20px rgba(26,26,26,.1); }
  .fb-badge-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.green}; box-shadow: 0 0 0 3px rgba(63,107,63,.22); animation: fb-pulse 2.2s ease-in-out infinite; flex-shrink: 0; }
  .fb-badge-text { font-size: 12px; font-weight: 700; color: ${T.charcoal}; letter-spacing: -.1px; line-height: 1.3; }
  .fb-badge-text span { display: block; font-size: 11px; font-weight: 400; color: ${T.gray}; }

  /* Full-width hero image section */
  #fb-hero-image { padding: 0 48px; }
  .fb-full-img-wrap { position: relative; border-radius: 22px; overflow: hidden; aspect-ratio: 16/6.8; }
  .fb-full-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 10s ease; }
  .fb-full-img-wrap:hover img { transform: scale(1.04); }
  .fb-full-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,8,8,.75) 0%, rgba(8,8,8,.2) 38%, transparent 65%); }
  .fb-full-img-bottom { position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: flex-end; padding: 36px 44px; }
  .fb-full-tagline { font-size: clamp(18px, 2.2vw, 28px); font-weight: 700; letter-spacing: -.4px; color: #fff; max-width: 360px; line-height: 1.2; }
  .fb-full-demo { display: inline-flex; align-items: center; gap: 9px; font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,.72); letter-spacing: .07em; text-transform: uppercase; border: 1px solid rgba(255,255,255,.28); padding: 11px 20px; border-radius: 999px; cursor: pointer; transition: all .22s; background: transparent; font-family: inherit; }
  .fb-full-demo:hover { background: rgba(255,255,255,.1); color: #fff; }

  /* Stats */
  #fb-stats { border-top: 1px solid ${T.border}; border-bottom: 1px solid ${T.border}; margin-top: 80px; }
  .fb-stats-grid { max-width: 1320px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); }
  .fb-stat { padding: 52px 44px; border-right: 1px solid ${T.border}; transition: background .2s; cursor: default; }
  .fb-stat:last-child { border-right: none; }
  .fb-stat:hover { background: rgba(63,107,63,.035); }
  .fb-stat-num { font-size: clamp(32px, 3.2vw, 50px); font-weight: 900; letter-spacing: -1.8px; color: ${T.charcoal}; margin-bottom: 10px; }
  .fb-stat-num span { color: ${T.green}; }
  .fb-stat-lbl { font-size: 12px; font-weight: 600; color: ${T.gray}; letter-spacing: .05em; text-transform: uppercase; }

  /* Problem */
  #fb-problem { padding: 128px 0; }
  .fb-problem-inner { display: grid; grid-template-columns: 180px 1fr; gap: 88px; align-items: start; }
  .fb-year { font-size: 12px; font-weight: 700; color: ${T.grayLt}; letter-spacing: .12em; text-transform: uppercase; padding-top: 10px; }
  .fb-problem-h { font-size: clamp(28px, 3.2vw, 52px); font-weight: 900; letter-spacing: -1.5px; line-height: 1.08; color: ${T.charcoal}; margin-bottom: 52px; }
  .fb-tags { display: flex; gap: 12px; flex-wrap: wrap; }
  .fb-tag { padding: 10px 24px; border-radius: 999px; border: 1.5px solid ${T.border}; font-size: 13px; font-weight: 600; color: ${T.charcoal}; transition: all .22s; cursor: default; }
  .fb-tag:hover { border-color: ${T.green}; color: ${T.green}; background: rgba(63,107,63,.04); }
  .fb-divider { height: 1px; background: ${T.border}; margin-top: 88px; }

  /* Section label */
  .fb-section-label { display: flex; align-items: center; gap: 12px; font-size: 11px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; color: ${T.green}; margin-bottom: 52px; }
  .fb-section-label::before { content: ''; flex: none; width: 22px; height: 2px; background: ${T.green}; border-radius: 2px; }

  /* How it works */
  #fb-hiw { padding: 120px 0; }
  .fb-hiw-h { font-size: clamp(26px, 2.8vw, 42px); font-weight: 900; letter-spacing: -1px; color: ${T.charcoal}; margin-bottom: 60px; max-width: 460px; }
  .fb-hiw-steps { display: grid; grid-template-columns: repeat(4, 1fr); }
  .fb-step { padding: 40px 36px 40px 0; border-right: 1px solid ${T.border}; transition: background .25s; }
  .fb-step:last-child { border-right: none; padding-right: 0; }
  .fb-step:first-child { padding-left: 0; }
  .fb-step:not(:first-child) { padding-left: 36px; }
  .fb-step:hover { background: rgba(63,107,63,.03); }
  .fb-step-num { font-size: 11px; font-weight: 700; letter-spacing: .1em; color: ${T.green}; margin-bottom: 22px; display: flex; align-items: center; gap: 12px; }
  .fb-step-num::after { content: ''; flex: 1; height: 1px; background: ${T.border}; }
  .fb-step-icon { width: 46px; height: 46px; background: ${T.charcoal}; border-radius: 12px; display: grid; place-items: center; margin-bottom: 20px; transition: background .25s; }
  .fb-step:hover .fb-step-icon { background: ${T.green}; }
  .fb-step-icon svg { width: 22px; height: 22px; stroke: #fff; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .fb-step-title { font-size: 16px; font-weight: 700; color: ${T.charcoal}; margin-bottom: 12px; letter-spacing: -.3px; }
  .fb-step-desc { font-size: 13px; color: ${T.gray}; line-height: 1.75; }

  /* Features */
  #fb-features { padding: 0 0 128px; }
  .fb-feat-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; }
  .fb-feat-h { font-size: clamp(26px, 2.8vw, 42px); font-weight: 900; letter-spacing: -1px; max-width: 400px; }
  .fb-feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid ${T.border}; border-radius: 20px; overflow: hidden; }
  .fb-feat-card { padding: 48px 44px; border-right: 1px solid ${T.border}; border-bottom: 1px solid ${T.border}; transition: background .25s; position: relative; overflow: hidden; }
  .fb-feat-card:nth-child(3n) { border-right: none; }
  .fb-feat-card:nth-last-child(-n+3) { border-bottom: none; }
  .fb-feat-card:hover { background: rgba(63,107,63,.04); }
  .fb-feat-icon { width: 48px; height: 48px; border: 1.5px solid ${T.border}; border-radius: 12px; display: grid; place-items: center; margin-bottom: 24px; transition: all .3s; }
  .fb-feat-card:hover .fb-feat-icon { background: ${T.green}; border-color: ${T.green}; }
  .fb-feat-icon svg { width: 22px; height: 22px; stroke: ${T.charcoal}; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; transition: stroke .3s; }
  .fb-feat-card:hover .fb-feat-icon svg { stroke: #fff; }
  .fb-feat-title { font-size: 15.5px; font-weight: 700; color: ${T.charcoal}; margin-bottom: 12px; letter-spacing: -.3px; }
  .fb-feat-desc { font-size: 13px; color: ${T.gray}; line-height: 1.78; }
  .fb-feat-corner { position: absolute; bottom: 18px; right: 22px; font-size: 24px; opacity: .06; color: ${T.charcoal}; transition: opacity .3s, color .3s; pointer-events: none; }
  .fb-feat-card:hover .fb-feat-corner { opacity: .16; color: ${T.green}; }

  /* Footer CTA */
  #fb-footer-cta { background: ${T.charcoal}; padding: 128px 0; position: relative; overflow: hidden; }
  .fb-cta-glow { position: absolute; inset: 0; background: radial-gradient(ellipse at 60% 50%, rgba(63,107,63,.2) 0%, transparent 62%); pointer-events: none; }
  .fb-cta-inner { text-align: center; position: relative; z-index: 1; }
  .fb-cta-label { font-size: 11px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: rgba(255,255,255,.35); margin-bottom: 28px; }
  .fb-cta-h { font-size: clamp(38px, 5.5vw, 72px); font-weight: 900; letter-spacing: -2.5px; color: #fff; line-height: 1.03; margin-bottom: 52px; }
  .fb-cta-h em { font-style: normal; color: #A8D5A8; }
  .fb-cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .fb-btn-white { background: #fff; color: ${T.charcoal}; padding: 15px 34px; border-radius: 999px; font-size: 15px; font-weight: 700; cursor: pointer; border: none; font-family: inherit; transition: all .25s; }
  .fb-btn-white:hover { background: #f0f0f0; transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,0,0,.22); }
  .fb-btn-ghost { background: transparent; color: rgba(255,255,255,.65); padding: 15px 34px; border-radius: 999px; font-size: 15px; font-weight: 600; cursor: pointer; border: 1.5px solid rgba(255,255,255,.2); font-family: inherit; transition: all .25s; }
  .fb-btn-ghost:hover { border-color: rgba(255,255,255,.5); color: #fff; }

  /* Footer */
  .fb-footer { background: #0F0F0F; padding: 44px 0; border-top: 1px solid rgba(255,255,255,.05); }
  .fb-footer-inner { max-width: 1320px; margin: 0 auto; padding: 0 48px; display: flex; justify-content: space-between; align-items: center; }
  .fb-footer-logo { font-size: 15px; font-weight: 800; color: rgba(255,255,255,.4); letter-spacing: -.3px; }
  .fb-footer-links { display: flex; gap: 28px; }
  .fb-footer-links a { font-size: 12px; color: rgba(255,255,255,.28); text-decoration: none; transition: color .2s; }
  .fb-footer-links a:hover { color: rgba(255,255,255,.65); }
  .fb-footer-copy { font-size: 12px; color: rgba(255,255,255,.2); }

  /* Marquee */
  #fb-marquee { overflow: hidden; width: 100%; padding: 60px 0; background: ${T.cream}; border-top: 1px solid ${T.border}; border-bottom: 1px solid ${T.border}; position: relative; }
  #fb-marquee::before, #fb-marquee::after { content: ''; position: absolute; top: 0; bottom: 0; width: 140px; z-index: 2; pointer-events: none; }
  #fb-marquee::before { left: 0; background: linear-gradient(to right, ${T.cream}, transparent); }
  #fb-marquee::after  { right: 0; background: linear-gradient(to left,  ${T.cream}, transparent); }
  .fb-mq-track { display: flex; gap: 18px; width: max-content; animation: fb-mq-scroll 35s linear infinite; }
  .fb-mq-track:hover { animation-play-state: paused; }
  @keyframes fb-mq-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .fb-mq-item { flex-shrink: 0; width: 300px; height: 220px; border-radius: 16px; overflow: hidden; position: relative; }
  .fb-mq-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s ease; }
  .fb-mq-item:hover img { transform: scale(1.06); }
  .fb-mq-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 14px; background: linear-gradient(to top, rgba(10,10,10,.55), transparent); font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: rgba(255,255,255,.85); opacity: 0; transition: opacity .3s; }
  .fb-mq-item:hover .fb-mq-label { opacity: 1; }

  /* Responsive */
  @media (max-width: 1024px) {
    .fb-hero-inner { grid-template-columns: 1fr; }
    .fb-hero-right { display: none; }
    .fb-hiw-steps { grid-template-columns: repeat(2, 1fr); }
    .fb-step { border-bottom: 1px solid ${T.border} !important; padding: 32px 24px !important; }
    .fb-step:nth-child(odd) { border-right: 1px solid ${T.border} !important; }
    .fb-step:nth-child(even) { border-right: none !important; }
    .fb-step:nth-last-child(-n+2) { border-bottom: none !important; }
    .fb-feat-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .fb-container { padding: 0 24px; }
    #fb-hero-image { padding: 0 24px; }
    .fb-nav-links { display: none; }
    .fb-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .fb-problem-inner { grid-template-columns: 1fr; gap: 20px; }
    .fb-feat-grid { grid-template-columns: 1fr; }
    .fb-feat-header { flex-direction: column; align-items: flex-start; gap: 20px; }
    .fb-footer-inner { flex-direction: column; gap: 18px; text-align: center; }
    .fb-footer-links { flex-wrap: wrap; justify-content: center; }
  }
`;

const LandingPage = ({ isLoggedIn, onExploreApp, onOpenAuth }) => {
  const rootRef = useRef(null);

  /* Inject global CSS once */
  useEffect(() => {
    const id = 'fb-global-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
    return () => {
      // Keep styles while app lives; remove only on full unmount if needed
    };
  }, []);

  /* Scroll-reveal observer */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll('.fb-reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('fb-visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    els.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('fb-visible');
      else obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const goHome = () => isLoggedIn ? onExploreApp('home') : onOpenAuth('signup');

  return (
    <div className="fb-root" ref={rootRef}>

      {/* Dashed guide lines */}
      <div className="fb-guide-wrap" aria-hidden="true">
        <div className="fb-guide-line" />
        <div className="fb-guide-line" />
      </div>

      {/* ══ NAVBAR ══ */}
      <nav className="fb-nav">
        <div className="fb-nav-inner">
          <button className="fb-nav-logo" onClick={() => {}}>
            <div className="fb-nav-logo-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="#fff" stroke="none"/>
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            KishanSetu
          </button>

          <ul className="fb-nav-links">
            <li><a>Home</a></li>
            <li><a href="#fb-hiw">How It Works</a></li>
            <li><a href="#fb-features">For Farmers</a></li>
            <li><a href="#fb-features">For Buyers</a></li>
            <li><a href="#fb-stats">Market Prices</a></li>
            <li><a href="#fb-problem">About</a></li>
          </ul>

          <div className="fb-nav-actions">
            {isLoggedIn ? (
              <button className="fb-btn fb-btn-dark" onClick={() => onExploreApp('home')}>Go to Dashboard →</button>
            ) : (
              <>
                <button className="fb-btn fb-btn-dark" style={{ background: '#3F6B3F', color: '#FFFFFF' }} onClick={() => onExploreApp('home')}>Explore Dashboard →</button>
                <button className="fb-nav-signin" onClick={() => onOpenAuth('signin')}>Sign In</button>
                <button className="fb-btn fb-btn-dark" onClick={() => onOpenAuth('signup')}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="fb-hero">
        <div className="fb-container">
          <div className="fb-hero-inner">

            {/* LEFT */}
            <div style={{ position: 'relative' }}>
              {/* Sparkles */}
              <span className="fb-sparkle" style={{ top: '-20px', right: '20px', fontSize: '26px', animationDelay: '0s' }}>✦</span>
              <span className="fb-sparkle fb-sparkle-green" style={{ top: '80px', right: '-30px', fontSize: '16px', animationDelay: '1.6s' }}>+</span>
              <span className="fb-sparkle" style={{ top: '200px', right: '10px', fontSize: '12px', animationDelay: '3.2s' }}>✦</span>
              <span className="fb-sparkle" style={{ top: '40px', left: '-20px', fontSize: '22px', animationDelay: '2.1s' }}>+</span>
              <span className="fb-sparkle" style={{ top: '160px', left: '30px', fontSize: '10px', animationDelay: '0.8s' }}>✦</span>

              <div className="fb-hero-tag fb-reveal">
                <span className="fb-tag-dot" />
                Real-Time Agri Market Intelligence
              </div>

              <h1 className="fb-hero-headline fb-reveal fb-d1">
                Fair Prices.<br />Faster Sales.<br />Farm to Buyer,<br />Simplified.
              </h1>

              <p className="fb-hero-sub fb-reveal fb-d2">
                KishanSetu connects farmers, FPOs, and cooperatives with verified buyers using live market data, smart sale-window alerts, and end-to-end transaction support.
              </p>

              <div className="fb-reveal fb-d3">
                <button className="fb-btn fb-btn-dark" style={{ fontSize: '15px', padding: '15px 34px' }} onClick={() => document.getElementById('fb-stats')?.scrollIntoView({ behavior: 'smooth' })}>
                  Check Today's Prices →
                </button>
              </div>
            </div>

            {/* RIGHT — barn image */}
            <div className="fb-hero-right fb-reveal fb-d2">
              <div className="fb-hero-frame" aria-hidden="true" />
              <div className="fb-hero-img-wrap">
                <img src={barnImg} alt="Red barn farmhouse with lush green crop fields" loading="eager" />
                <div className="fb-hero-badge">
                  <span className="fb-badge-dot" />
                  <div className="fb-badge-text">
                    Live Market Data
                    <span>Updated every 15 mins</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ FULL-WIDTH HERO IMAGE ══ */}
      <section id="fb-hero-image">
        <div className="fb-full-img-wrap fb-reveal">
          <img src={heroFarm} alt="Golden hour aerial view of farmland and mandi" loading="eager" />
          <div className="fb-full-img-overlay" />
          <div className="fb-full-img-bottom">
            <p className="fb-full-tagline">Empowering Every Farmer's<br />Sale Decision.</p>
            <button className="fb-full-demo" onClick={goHome}>Join a Free Demo Onboarding</button>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section id="fb-stats">
        <div className="fb-stats-grid">
          {[
            { val: '10,000', suf: '+', lbl: 'Farmers Onboarded' },
            { val: '500',    suf: '+', lbl: 'Verified Buyers' },
            { val: '1,200', suf: '+', lbl: 'Markets Tracked Daily' },
            { val: '₹50 Cr',suf: '+', lbl: 'Transaction Value' },
          ].map((s, i) => (
            <div key={i} className={`fb-stat fb-reveal fb-d${i}`}>
              <div className="fb-stat-num">{s.val}<span>{s.suf}</span></div>
              <div className="fb-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PROBLEM ══ */}
      <section id="fb-problem">
        <div className="fb-container">
          <div className="fb-problem-inner">
            <div className="fb-year fb-reveal">2025</div>
            <div>
              <h2 className="fb-problem-h fb-reveal">
                Despite Rising Agri-Tech Adoption, Farmers Still Sell Blind — Missing Better Prices, Better Buyers, Better Timing.
              </h2>
              <div className="fb-tags fb-reveal fb-d1">
                {['Price Discovery', 'Buyer Matching', 'Logistics Support'].map(t => (
                  <span key={t} className="fb-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="fb-divider" />
        </div>
      </section>

      {/* ══ IMAGE MARQUEE ══ */}
      <section id="fb-marquee">
        <div className="fb-mq-track">
          {[
            { src: slide1, label: 'Wheat Harvest' },
            { src: slide2, label: 'Garden Farming' },
            { src: slide3, label: 'Modern Agri-Tech' },
            { src: slide4, label: 'Pastoral Fields' },
            { src: slide5, label: 'From the Ground Up' },
            { src: heroFarm, label: 'Mandi Markets' },
            { src: barnImg, label: 'Farm Infrastructure' },
            /* duplicate set for seamless loop */
            { src: slide1, label: 'Wheat Harvest' },
            { src: slide2, label: 'Garden Farming' },
            { src: slide3, label: 'Modern Agri-Tech' },
            { src: slide4, label: 'Pastoral Fields' },
            { src: slide5, label: 'From the Ground Up' },
            { src: heroFarm, label: 'Mandi Markets' },
            { src: barnImg, label: 'Farm Infrastructure' },
          ].map((img, i) => (
            <div key={i} className="fb-mq-item">
              <img src={img.src} alt={img.label} loading="eager" />
              <span className="fb-mq-label">{img.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="fb-hiw">
        <div className="fb-container">
          <div className="fb-section-label">Process</div>
          <h2 className="fb-hiw-h fb-reveal">How KishanSetu Works — In 4 Simple Steps</h2>
          <div className="fb-hiw-steps">
            {[
              { num: '01', title: 'Register & Verify', desc: 'Farmers and FPOs sign up, submit KYC documents and crop inventory. Buyers complete a verified business profile in minutes.',
                icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
              { num: '02', title: 'Access Live Prices', desc: 'View real-time mandi prices, trend forecasts, and AI-powered sale-window recommendations across 1,200+ markets.',
                icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
              { num: '03', title: 'Match with Buyers', desc: 'Our algorithm matches your crop quality and quantity with verified, pre-screened buyers who have active purchase requirements.',
                icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></> },
              { num: '04', title: 'Transact & Track', desc: 'Finalize the deal, coordinate logistics, and track payment milestones — all from a single dashboard with full visibility.',
                icon: <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></> },
            ].map((s, i) => (
              <div key={i} className={`fb-step fb-reveal fb-d${i}`}>
                <div className="fb-step-num">{s.num}</div>
                <div className="fb-step-icon">
                  <svg viewBox="0 0 24 24">{s.icon}</svg>
                </div>
                <div className="fb-step-title">{s.title}</div>
                <p className="fb-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="fb-features">
        <div className="fb-container">
          <div className="fb-feat-header">
            <div>
              <div className="fb-section-label">Platform Features</div>
              <h2 className="fb-feat-h fb-reveal">Everything You Need to Sell Smarter</h2>
            </div>
            <button className="fb-btn fb-btn-outline fb-reveal" onClick={goHome}>Explore All Features →</button>
          </div>
          <div className="fb-feat-grid">
            {[
              { title: 'Live Price Dashboard', desc: 'Real-time mandi prices updated every 15 minutes across 28 states and 1,200+ APMC markets. Compare, track and act instantly.', corner: '✦',
                icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
              { title: 'Sale-Window Recommendations', desc: 'AI-powered alerts that tell you the best time to sell based on historical price curves, seasonal demand and weather data.', corner: '+',
                icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
              { title: 'Verified Buyer Matching', desc: 'Every buyer is KYC-verified and rated. Smart matching based on your crop, grade, quantity, and preferred payment terms.', corner: '✦',
                icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></> },
              { title: 'Digital Grading', desc: 'Submit crop samples via photos; our grading engine scores quality against AGMARK standards, building credibility with buyers.', corner: '+',
                icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></> },
              { title: 'Logistics Coordination', desc: 'Book verified transport partners for farm pickup and delivery. Track your shipment in real time from field to warehouse.', corner: '✦',
                icon: <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></> },
              { title: 'Payment Tracking', desc: 'Milestone-based payment escrow with real-time status. Get paid faster with built-in dispute resolution support.', corner: '+',
                icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></> },
            ].map((f, i) => (
              <div key={i} className="fb-feat-card fb-reveal">
                <div className="fb-feat-icon">
                  <svg viewBox="0 0 24 24">{f.icon}</svg>
                </div>
                <div className="fb-feat-title">{f.title}</div>
                <p className="fb-feat-desc">{f.desc}</p>
                <span className="fb-feat-corner" aria-hidden="true">{f.corner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER CTA ══ */}
      <section id="fb-footer-cta">
        <div className="fb-cta-glow" />
        <div className="fb-container">
          <div className="fb-cta-inner">
            <div className="fb-cta-label">Get Started Today — It's Free</div>
            <h2 className="fb-cta-h fb-reveal">Ready to Sell <em>Smarter</em>?</h2>
            <div className="fb-cta-actions fb-reveal fb-d1">
              <button className="fb-btn-white" onClick={goHome}>Start for Free →</button>
              <button className="fb-btn-ghost" onClick={() => onOpenAuth('signup')}>Book a Live Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="fb-footer">
        <div className="fb-footer-inner">
          <span className="fb-footer-logo">KishanSetu</span>
          <div className="fb-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Contact</a>
            <a href="#">Careers</a>
          </div>
          <span className="fb-footer-copy">© 2025 KishanSetu Technologies Pvt. Ltd.</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
