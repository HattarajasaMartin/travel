export function FlyingPlane() {
  return (
    <div style={{ position: "relative", width: 180, height: 44, overflow: "hidden", flexShrink: 0 }}>
      <style>{`
        @keyframes planeFly {
          0%   { transform: translateX(-130px) translateY(0px); }
          20%  { transform: translateX(10px) translateY(-2px); }
          50%  { transform: translateX(80px) translateY(1px); }
          80%  { transform: translateX(150px) translateY(-1px); }
          100% { transform: translateX(310px) translateY(0px); }
        }
        @keyframes planeBob {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          30%     { transform: translateY(-2.5px) rotate(-0.8deg); }
          70%     { transform: translateY(2px) rotate(0.5deg); }
        }
        @keyframes wind1 {
          0%   { opacity:0; stroke-dashoffset:40; }
          25%  { opacity:0.9; }
          75%  { opacity:0.5; }
          100% { opacity:0; stroke-dashoffset:-10; }
        }
        @keyframes wind2 {
          0%   { opacity:0; stroke-dashoffset:50; }
          25%  { opacity:0.7; }
          75%  { opacity:0.3; }
          100% { opacity:0; stroke-dashoffset:-8; }
        }
        @keyframes wind3 {
          0%   { opacity:0; stroke-dashoffset:30; }
          30%  { opacity:0.6; }
          80%  { opacity:0.2; }
          100% { opacity:0; stroke-dashoffset:-12; }
        }
        @keyframes smokeTrail {
          0%   { opacity:0.55; r:3; cx:5; }
          100% { opacity:0;   r:7; cx:-18; }
        }
        @keyframes smokeTrail2 {
          0%   { opacity:0.4; r:2.5; cx:5; }
          100% { opacity:0;   r:6;   cx:-22; }
        }
        @keyframes engineGlow {
          0%,100% { opacity:0.6; }
          50%     { opacity:1; }
        }
        @keyframes windowFlash {
          0%,90%,100% { opacity:0.55; }
          95%         { opacity:0.95; }
        }
        .fp-plane  { animation: planeFly 4.2s cubic-bezier(0.45,0,0.55,1) infinite; position:absolute; top:50%; margin-top:-16px; left:0; display:flex; align-items:center; }
        .fp-bob    { animation: planeBob 1.1s ease-in-out infinite; transform-origin:50% 50%; }
        .fp-wind1  { animation: wind1 0.6s ease-in-out infinite 0s;    stroke-dasharray:22 8; }
        .fp-wind2  { animation: wind2 0.6s ease-in-out infinite 0.18s; stroke-dasharray:18 10; }
        .fp-wind3  { animation: wind3 0.6s ease-in-out infinite 0.32s; stroke-dasharray:14 12; }
        .fp-smoke1 { animation: smokeTrail  0.7s ease-out infinite 0s; }
        .fp-smoke2 { animation: smokeTrail2 0.7s ease-out infinite 0.22s; }
        .fp-smoke3 { animation: smokeTrail  0.7s ease-out infinite 0.44s; }
        .fp-glow   { animation: engineGlow 0.8s ease-in-out infinite; }
        .fp-win    { animation: windowFlash 3.5s ease-in-out infinite; }
      `}</style>

      <div className="fp-plane">
        <div className="fp-bob">
          <svg width="80" height="32" viewBox="0 0 80 32" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#e0f2fe"/>
                <stop offset="40%"  stopColor="#f0f9ff"/>
                <stop offset="100%" stopColor="#bae6fd"/>
              </linearGradient>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#7dd3fc"/>
                <stop offset="100%" stopColor="#38bdf8"/>
              </linearGradient>
              <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#7dd3fc"/>
                <stop offset="100%" stopColor="#bae6fd"/>
              </linearGradient>
              <radialGradient id="engineGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#fbbf24" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <circle className="fp-smoke1" cx="5" cy="16" r="3"   fill="#cbd5e1" opacity="0.55"/>
            <circle className="fp-smoke2" cx="5" cy="15" r="2.5" fill="#e2e8f0" opacity="0.4"/>
            <circle className="fp-smoke3" cx="5" cy="17" r="2"   fill="#cbd5e1" opacity="0.3"/>
            <circle className="fp-glow" cx="13" cy="16" r="5" fill="url(#engineGlowGrad)" opacity="0.6"/>
            <polygon points="32,18 50,18 54,26 38,22" fill="url(#wingGrad)" opacity="0.7"/>
            <polygon points="28,14 56,13 62,7 46,13" fill="url(#wingGrad)" opacity="0.95"/>
            <ellipse cx="42" cy="16" rx="30" ry="8" fill="url(#bodyGrad)" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.97"/>
            <path d="M70 16 Q80 14 78 16 Q80 18 70 16Z" fill="#bae6fd"/>
            <path d="M14 16 Q12 6 20 8 L22 14Z" fill="url(#tailGrad)" opacity="0.9"/>
            <polygon points="14,16 22,15 24,18 16,18" fill="url(#wingGrad)" opacity="0.85"/>
            <line x1="14" y1="16" x2="70" y2="16" stroke="#93c5fd" strokeWidth="0.4" opacity="0.5"/>
            <rect className="fp-win" x="36" y="11" width="4"   height="3.5" rx="1.2" fill="#0ea5e9" opacity="0.55"/>
            <rect className="fp-win" x="43" y="11" width="4"   height="3.5" rx="1.2" fill="#38bdf8" opacity="0.5"/>
            <rect className="fp-win" x="50" y="11" width="3.5" height="3.5" rx="1.2" fill="#7dd3fc" opacity="0.45"/>
            <rect className="fp-win" x="57" y="11" width="3"   height="3.5" rx="1.2" fill="#bae6fd" opacity="0.4"/>
            <ellipse cx="46" cy="11" rx="18" ry="3" fill="white" opacity="0.18"/>
            <ellipse cx="36" cy="20" rx="6"  ry="2.5" fill="#93c5fd" stroke="#7dd3fc" strokeWidth="0.4"/>
            <ellipse cx="52" cy="19" rx="5"  ry="2"   fill="#93c5fd" stroke="#7dd3fc" strokeWidth="0.4"/>
            <ellipse cx="13" cy="16" rx="3.5" ry="2.5" fill="#1e40af" opacity="0.5"/>
            <ellipse cx="13" cy="16" rx="2"   ry="1.5" fill="#fbbf24" opacity="0.6"/>
          </svg>
        </div>

        <svg width="44" height="32" viewBox="0 0 44 32" style={{ marginLeft: -6 }}>
          <line className="fp-wind1" x1="40" y1="12" x2="2" y2="12" stroke="#7dd3fc"  strokeWidth="1.6" strokeLinecap="round"/>
          <line className="fp-wind2" x1="42" y1="16" x2="0" y2="16" stroke="#bae6fd"  strokeWidth="1.2" strokeLinecap="round"/>
          <line className="fp-wind3" x1="38" y1="21" x2="4" y2="21" stroke="#93c5fd"  strokeWidth="1"   strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}