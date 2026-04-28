"use client";

const STARS = [
  { cx: 30,  cy: 18,  r: 1.8, cls: "star-a", delay: "0s" },
  { cx: 90,  cy: 8,   r: 1.4, cls: "star-b", delay: "0.5s" },
  { cx: 175, cy: 30,  r: 1.7, cls: "star-a", delay: "0.9s" },
  { cx: 250, cy: 12,  r: 1.4, cls: "star-c", delay: "1.3s" },
  { cx: 330, cy: 28,  r: 1.6, cls: "star-b", delay: "0.2s" },
  { cx: 420, cy: 10,  r: 1.8, cls: "star-a", delay: "0.7s" },
  { cx: 490, cy: 40,  r: 1.4, cls: "star-b", delay: "1.1s" },
  { cx: 510, cy: 180, r: 1.6, cls: "star-a", delay: "0.4s" },
  { cx: 500, cy: 290, r: 1.5, cls: "star-c", delay: "1.6s" },
  { cx: 18,  cy: 260, r: 1.4, cls: "star-b", delay: "0.3s" },
  { cx: 55,  cy: 170, r: 1.7, cls: "star-a", delay: "1.8s" },
  { cx: 460, cy: 130, r: 1.4, cls: "star-c", delay: "0.8s" },
  { cx: 100, cy: 320, r: 1.5, cls: "star-b", delay: "1.4s" },
  { cx: 370, cy: 335, r: 1.6, cls: "star-a", delay: "0.6s" },
  { cx: 22,  cy: 85,  r: 1.4, cls: "star-c", delay: "1.0s" },
];

const DIAMOND_STARS = [
  { x: 128, y: 60,  size: 6, delay: "0.6s" },
  { x: 468, y: 75,  size: 5, delay: "1.2s" },
  { x: 48,  y: 308, size: 5, delay: "0.3s" },
];

export function HeroScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 520 360"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="eGrad" cx="38%" cy="32%" r="62%">
            <stop offset="0%"   stopColor="#38bdf8" />
            <stop offset="45%"  stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>
          <radialGradient id="eAtmo" cx="50%" cy="50%" r="50%">
            <stop offset="55%"  stopColor="transparent" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="moonG" cx="35%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
          <clipPath id="eClip">
            <circle cx="320" cy="190" r="106" />
          </clipPath>
        </defs>

        {STARS.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#bae6fd" className={s.cls} style={{ animationDelay: s.delay }} />
        ))}

        {DIAMOND_STARS.map((s, i) => (
          <g key={i} className="star-b" style={{ animationDelay: s.delay }}>
            <polygon points={`${s.x},${s.y - s.size} ${s.x + 1.5},${s.y} ${s.x},${s.y + s.size} ${s.x - 1.5},${s.y}`} fill="#7dd3fc" opacity="0.9" />
            <polygon points={`${s.x - s.size},${s.y} ${s.x},${s.y + 1.5} ${s.x + s.size},${s.y} ${s.x},${s.y - 1.5}`} fill="#7dd3fc" opacity="0.9" />
          </g>
        ))}

        <line x1="52"  y1="138" x2="96"  y2="124" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" className="shoot1" />
        <line x1="398" y1="58"  x2="442" y2="45"  stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" className="shoot2" />

        <circle cx="108" cy="76" r="26" fill="url(#moonG)" opacity="0.88" />
        <circle cx="101" cy="71" r="4.5" fill="#cbd5e1" opacity="0.35" />
        <circle cx="116" cy="83" r="3"   fill="#cbd5e1" opacity="0.28" />
        <circle cx="104" cy="85" r="2"   fill="#cbd5e1" opacity="0.22" />

        <circle cx="320" cy="190" r="124" fill="none" stroke="#38bdf8" strokeWidth="32" className="glow-pulse" opacity="0.13" />
        <circle cx="320" cy="190" r="106" fill="url(#eGrad)" />

        <g clipPath="url(#eClip)" className="earth-land">
          <ellipse cx="303" cy="150" rx="26" ry="20" fill="#0c4a6e" opacity="0.88" />
          <ellipse cx="297" cy="182" rx="17" ry="28" fill="#0c4a6e" opacity="0.82" />
          <ellipse cx="252" cy="162" rx="18" ry="25" fill="#075985" opacity="0.80" />
          <ellipse cx="256" cy="200" rx="13" ry="18" fill="#075985" opacity="0.75" />
          <ellipse cx="366" cy="154" rx="30" ry="18" fill="#0c4a6e" opacity="0.88" />
          <ellipse cx="374" cy="180" rx="17" ry="13" fill="#0c4a6e" opacity="0.72" />
          <ellipse cx="372" cy="224" rx="15" ry="9"  fill="#075985" opacity="0.75" />
          <ellipse cx="320" cy="92"  rx="38" ry="11" fill="#e0f2fe" opacity="0.28" />
          <ellipse cx="320" cy="288" rx="32" ry="9"  fill="#e0f2fe" opacity="0.20" />
        </g>

        <circle cx="320" cy="190" r="106" fill="url(#eAtmo)" opacity="0.6" />
        <circle cx="320" cy="190" r="106" fill="none" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.45" />
        <ellipse cx="320" cy="190" rx="150" ry="40" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 5" opacity="0.32" transform="rotate(-10, 320, 190)" />

        <g className="plane-orbit" style={{ transformOrigin: "320px 190px" }}>
          <g transform="translate(320, 152) rotate(90)">
            <ellipse cx="0" cy="0" rx="5" ry="17" fill="#f0f9ff" />
            <polygon points="-16,-3 16,-3 7,4 -7,4" fill="#bae6fd" opacity="0.95" />
            <polygon points="-4,12 4,12 3,18 -3,18" fill="#7dd3fc" />
            <rect x="-2" y="-7" width="4" height="3" rx="1" fill="#0369a1" opacity="0.6" />
            <circle cx="-12" cy="0" r="2.5" fill="#38bdf8" opacity="0.55" />
            <circle cx="12"  cy="0" r="2.5" fill="#38bdf8" opacity="0.55" />
          </g>
        </g>
      </svg>
    </div>
  );
}