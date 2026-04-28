export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  .font-display { font-family: 'Instrument Serif', serif; }
  .hero-bg {
    background: linear-gradient(135deg, #0a1628 0%, #0d2045 40%, #0a2a5e 70%, #0e3060 100%);
    position: relative; overflow: hidden;
  }
  .hero-bg::before {
    content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 15% 50%, rgba(56,189,248,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 85% 30%, rgba(99,102,241,0.15) 0%, transparent 60%);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .nav-glass { background: rgba(255,255,255,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,0,0,0.06); }
  .form-card { background: white; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04); overflow: hidden; }
  .card-header { padding: 16px 16px 0; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .card-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
  .card-title { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .field-label { display: block; font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 6px; }
  .input-base { width: 100%; border: 1.5px solid #e8ecf0; border-radius: 12px; padding: 11px 14px; font-size: 15px; font-weight: 500; color: #1a202c; background: #fafbfc; outline: none; transition: all 0.15s; font-family: 'DM Sans', sans-serif; -webkit-appearance: none; }
  .input-base:focus { border-color: #38bdf8; background: white; box-shadow: 0 0 0 3px rgba(56,189,248,0.1); }
  .input-base::placeholder { color: #b0bcc8; font-weight: 400; }
  .textarea-base { width: 100%; border: 1.5px solid #e8ecf0; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 500; color: #1a202c; background: #fafbfc; outline: none; resize: vertical; min-height: 70px; font-family: 'DM Sans', sans-serif; transition: all 0.15s; line-height: 1.6; }
  .textarea-base:focus { border-color: #38bdf8; background: white; box-shadow: 0 0 0 3px rgba(56,189,248,0.1); }
  .style-card { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 12px 14px; border-radius: 12px; cursor: pointer; border: 1.5px solid #edf0f5; background: #fafbfc; transition: all 0.18s; text-align: left; -webkit-tap-highlight-color: transparent; }
  .style-card:active { transform: scale(0.97); }
  .style-card.active { border: 2px solid #0ea5e9; background: #f0f9ff; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
  .style-emoji { font-size: 22px; line-height: 1; margin-bottom: 4px; }
  .counter-btn { width: 40px; height: 40px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 600; color: #64748b; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .counter-btn:active { background: #f0f9ff; border-color: #38bdf8; }
  .day-card { border-radius: 14px; border: 1.5px solid #e8ecf0; overflow: hidden; transition: border-color 0.15s, box-shadow 0.15s; background: white; }
  .day-card:hover { border-color: #bae6fd; box-shadow: 0 2px 12px rgba(14,165,233,0.08); }
  .day-card.editing { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
  .day-card-header { padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; }
  .day-badge { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #0369a1, #38bdf8); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
  .session-row { display: flex; gap: 10px; padding: 10px 16px; border-top: 1px solid #f8fafc; }
  .session-icon-wrap { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .session-label { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #94a3b8; margin-bottom: 2px; }
  .session-text { font-size: 13px; color: #475569; line-height: 1.6; }
  .edit-btn { font-size: 11px; font-weight: 700; color: #0ea5e9; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 6px 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; -webkit-tap-highlight-color: transparent; white-space: nowrap; }
  .save-btn { font-size: 11px; font-weight: 700; color: white; background: linear-gradient(135deg, #0369a1, #0ea5e9); border: none; border-radius: 8px; padding: 6px 14px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .cancel-btn { font-size: 11px; font-weight: 700; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #f1f5f9; display: flex; z-index: 50; padding-bottom: env(safe-area-inset-bottom); box-shadow: 0 -4px 20px rgba(0,0,0,0.06); }
  .bottom-tab { flex: 1; padding: 10px 4px; border: none; cursor: pointer; font-size: 11px; font-weight: 700; background: transparent; color: #94a3b8; transition: all 0.15s; font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; align-items: center; gap: 3px; -webkit-tap-highlight-color: transparent; }
  .bottom-tab.active { color: #0ea5e9; }
  .bottom-tab-icon { font-size: 20px; line-height: 1; }
  .bottom-tab-dot { width: 4px; height: 4px; border-radius: 50%; background: #0ea5e9; opacity: 0; transition: opacity 0.15s; }
  .bottom-tab.active .bottom-tab-dot { opacity: 1; }
  .gen-btn { width: 100%; color: white; border: none; border-radius: 14px; padding: 16px 0; font-size: 16px; font-weight: 700; cursor: pointer; background: linear-gradient(135deg, #0369a1, #0ea5e9 50%, #38bdf8); box-shadow: 0 4px 20px rgba(14,165,233,0.35); transition: all 0.2s; font-family: 'DM Sans', sans-serif; -webkit-tap-highlight-color: transparent; }
  .gen-btn:active:not(:disabled) { transform: scale(0.98); }
  .gen-btn:disabled { background: #bae6fd; cursor: not-allowed; box-shadow: none; }
  .bar-track { height: 6px; border-radius: 99px; background: #f1f5f9; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 99px; transition: width 0.7s cubic-bezier(.22,1,.36,1); }
  .spin { animation: rotate 0.8s linear infinite; }
  @keyframes rotate { to { transform: rotate(360deg); } }
  .days-badge { display: flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #eff6ff, #e0f2fe); border: 1px solid #bae6fd; border-radius: 12px; padding: 10px 14px; margin-top: 8px; }
  .budget-item { background: white; border: 1px solid #f1f5f9; border-radius: 14px; padding: 14px; }
  .result-scroll::-webkit-scrollbar { display: none; }
  .dest-tag { display: inline-flex; align-items: center; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 99px; padding: 5px 12px; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.85); }

  /* ── NAVBAR MOBILE ── */
  .nav-brand-text { font-size: 19px; }
  .nav-divider { display: flex; }
  .nav-flying { display: flex; }
  @media (max-width: 400px) {
    .nav-divider { display: none !important; }
    .nav-flying { display: none !important; }
    .nav-brand-text { font-size: 16px; }
  }

  /* ── HERO ANIMATION ── */
  .hero-scene { position: absolute; right: 0; top: 0; bottom: 0; width: 52%; pointer-events: none; }
  @media (max-width: 767px) { .hero-scene { width: 100%; opacity: 0.25; } }

  @keyframes starTwinkle { 0%,100% { opacity:1; } 50% { opacity:0.1; } }
  .star-a { animation: starTwinkle 2s ease-in-out infinite; }
  .star-b { animation: starTwinkle 3.2s ease-in-out infinite; }
  .star-c { animation: starTwinkle 1.5s ease-in-out infinite; }

  @keyframes planeOrbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .plane-orbit { animation: planeOrbit 7s linear infinite; transform-box: fill-box; transform-origin: center; }

  @keyframes glowPulse { 0%,100% { opacity:0.13; transform:scale(1); } 50% { opacity:0.04; transform:scale(1.08); } }
  .glow-pulse { animation: glowPulse 3.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }

  @keyframes earthShimmer { 0%,100% { opacity:0.8; } 50% { opacity:1; } }
  .earth-land { animation: earthShimmer 4s ease-in-out infinite; }

  @keyframes shootStar {
    0%   { opacity:0; transform:translate(0,0); }
    10%  { opacity:0.85; }
    45%  { opacity:0; transform:translate(70px,-24px); }
    100% { opacity:0; }
  }
  .shoot1 { animation: shootStar 5s ease-in-out infinite; }
  .shoot2 { animation: shootStar 7s ease-in-out infinite; animation-delay: 3.2s; }

  /* ── RESPONSIVE BREAKPOINTS ── */
  @media (min-width: 768px) {
    .bottom-nav { display: none !important; }
    .mobile-only { display: none !important; }
    .desktop-only { display: grid !important; }
  }
  @media (max-width: 767px) {
    .desktop-only { display: none !important; }
    .mobile-only { display: block !important; }

    /* Input lebih besar di mobile untuk kemudahan tap */
    .input-base { font-size: 16px !important; padding: 13px 14px; }
    .input-base[type="date"] { font-size: 14px !important; }

    /* Style cards 2 kolom tetap tapi lebih compact */
    .style-card { padding: 10px 10px; }
    .style-emoji { font-size: 20px; }

    /* Day card lebih compact */
    .day-card-header { padding: 12px 14px; }
    .session-row { padding: 8px 14px; gap: 8px; }

    /* Form card radius lebih kecil */
    .form-card { border-radius: 14px; }

    /* UserMenu dropdown full width di mobile */
    .user-menu-dropdown { width: calc(100vw - 32px) !important; right: -8px !important; }
  }

  /* ── SAFE AREA MOBILE ── */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .bottom-nav { padding-bottom: calc(env(safe-area-inset-bottom) + 4px); }
  }

  #pdf-print-area { display: none; }
  @media print {
    #pdf-print-area { display: block !important; padding: 24px; font-family: 'DM Sans', sans-serif; }
    .pdf-header { margin-bottom: 20px; border-bottom: 2px solid #0ea5e9; padding-bottom: 12px; }
    .pdf-title { font-size: 22px; font-weight: 800; color: #0f172a; }
    .pdf-meta { font-size: 12px; color: #64748b; margin-top: 4px; }
    .pdf-day { margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; page-break-inside: avoid; }
    .pdf-day-header { background: linear-gradient(135deg, #0369a1, #38bdf8); color: white; padding: 10px 14px; font-weight: 700; font-size: 13px; }
    .pdf-day-body { padding: 10px 14px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .pdf-session { font-size: 12px; }
    .pdf-session-label { font-weight: 700; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
    .pdf-session-text { color: #334155; line-height: 1.5; }
    .pdf-biaya { font-size: 11px; color: #0369a1; font-weight: 700; padding: 6px 14px; background: #eff6ff; border-top: 1px solid #e0f2fe; }
    body > *:not(#pdf-print-area) { display: none !important; }
  }
`;