export function RunningFamily() {
  return (
    <svg width="120" height="44" viewBox="0 0 120 44" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", overflow: "visible" }}>
      <style>{`
        @keyframes rfBob     { 0%,100%{transform:translateY(0)}       50%{transform:translateY(-2px)} }
        @keyframes rfLegF    { 0%,100%{transform:rotate(-28deg)}      50%{transform:rotate(28deg)} }
        @keyframes rfLegB    { 0%,100%{transform:rotate(28deg)}       50%{transform:rotate(-28deg)} }
        @keyframes rfArmF    { 0%,100%{transform:rotate(18deg)}       50%{transform:rotate(-22deg)} }
        @keyframes rfArmB    { 0%,100%{transform:rotate(-22deg)}      50%{transform:rotate(18deg)} }
        @keyframes rfKoper   { 0%,100%{transform:rotate(-6deg)}       50%{transform:rotate(6deg)} }
        @keyframes rfSmall   { 0%,100%{transform:translateY(0)}       50%{transform:translateY(-1.5px)} }
        @keyframes rfBalloon { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-3px) rotate(3deg)} }

        .dad-bob   { animation: rfBob    0.42s ease-in-out infinite;        transform-origin: 20px 22px; }
        .dad-legF  { animation: rfLegF   0.42s ease-in-out infinite;        transform-origin: 19px 29px; }
        .dad-legB  { animation: rfLegB   0.42s ease-in-out infinite;        transform-origin: 21px 29px; }
        .dad-armF  { animation: rfArmF   0.42s ease-in-out infinite;        transform-origin: 17px 21px; }
        .dad-armB  { animation: rfArmB   0.42s ease-in-out infinite;        transform-origin: 23px 21px; }
        .dad-koper { animation: rfKoper  0.42s ease-in-out infinite;        transform-origin: 34px 24px; }
        .mom-bob   { animation: rfBob    0.42s ease-in-out infinite 0.08s;  transform-origin: 52px 24px; }
        .mom-legF  { animation: rfLegF   0.42s ease-in-out infinite 0.08s;  transform-origin: 51px 31px; }
        .mom-legB  { animation: rfLegB   0.42s ease-in-out infinite 0.08s;  transform-origin: 53px 31px; }
        .mom-armF  { animation: rfArmF   0.42s ease-in-out infinite 0.08s;  transform-origin: 49px 23px; }
        .mom-armB  { animation: rfArmB   0.42s ease-in-out infinite 0.08s;  transform-origin: 55px 23px; }
        .kid-bob   { animation: rfSmall  0.36s ease-in-out infinite 0.14s;  transform-origin: 78px 28px; }
        .kid-legF  { animation: rfLegF   0.36s ease-in-out infinite 0.14s;  transform-origin: 77px 33px; }
        .kid-legB  { animation: rfLegB   0.36s ease-in-out infinite 0.14s;  transform-origin: 79px 33px; }
        .kid-armF  { animation: rfArmF   0.36s ease-in-out infinite 0.14s;  transform-origin: 75px 27px; }
        .kid-armB  { animation: rfArmB   0.36s ease-in-out infinite 0.14s;  transform-origin: 81px 27px; }
        .kid-balloon { animation: rfBalloon 0.7s ease-in-out infinite;      transform-origin: 80px 10px; }
      `}</style>

      {/* AYAH */}
      <g className="dad-bob">
        <circle cx="20" cy="8" r="5.5" fill="#fbbf24"/>
        <path d="M14.5 6.5 Q20 2 25.5 6.5" fill="#78350f" stroke="none"/>
        <rect x="16" y="13" width="8" height="10" rx="3" fill="#0369a1"/>
        <polygon points="20,14 21.5,14 20.8,19 19.2,19" fill="#38bdf8" opacity="0.9"/>
        <g className="dad-armB"><rect x="22" y="14" width="2.5" height="8" rx="1.2" fill="#fbbf24" transform="rotate(8,23,14)"/></g>
        <g className="dad-legB"><rect x="20" y="23" width="3" height="9" rx="1.5" fill="#1e3a5f"/><rect x="20" y="31" width="5" height="2.5" rx="1.2" fill="#1e3a5f"/></g>
        <g className="dad-legF"><rect x="16" y="23" width="3" height="9" rx="1.5" fill="#1e40af"/><rect x="13" y="31" width="5" height="2.5" rx="1.2" fill="#1e40af"/></g>
        <g className="dad-armF"><rect x="12" y="14" width="2.5" height="8" rx="1.2" fill="#fbbf24" transform="rotate(-8,14,14)"/></g>
        <g className="dad-koper">
          <rect x="28" y="20" width="11" height="8" rx="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1"/>
          <rect x="31" y="18" width="5" height="3" rx="1" fill="none" stroke="#d97706" strokeWidth="1.2"/>
          <line x1="30" y1="24" x2="37" y2="24" stroke="#d97706" strokeWidth="0.8"/>
          <line x1="28" y1="22" x2="22" y2="21" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      </g>

      {/* IBU */}
      <g className="mom-bob">
        <circle cx="52" cy="10" r="5" fill="#fcd34d"/>
        <path d="M47 9 Q52 4 57 9 L58 18 Q52 20 46 18 Z" fill="#7c3aed" opacity="0.85"/>
        <circle cx="52" cy="10" r="5" fill="#fcd34d"/>
        <circle cx="47.5" cy="11" r="1" fill="#f472b6"/>
        <rect x="48" y="15" width="8" height="8" rx="2.5" fill="#7c3aed"/>
        <path d="M47 22 Q52 28 57 22" fill="#7c3aed"/>
        <g className="mom-armB"><rect x="54" y="15" width="2.2" height="7" rx="1.1" fill="#fcd34d" transform="rotate(8,55,15)"/></g>
        <g className="mom-legB"><rect x="52" y="26" width="2.5" height="8" rx="1.2" fill="#4c1d95"/><rect x="52" y="33" width="4" height="2.2" rx="1" fill="#4c1d95"/></g>
        <g className="mom-legF"><rect x="49" y="26" width="2.5" height="8" rx="1.2" fill="#6d28d9"/><rect x="46" y="33" width="4" height="2.2" rx="1" fill="#6d28d9"/></g>
        <g className="mom-armF"><rect x="45" y="15" width="2.2" height="7" rx="1.1" fill="#fcd34d" transform="rotate(-8,47,15)"/></g>
        <rect x="42" y="20" width="6" height="5" rx="1.5" fill="#f472b6" stroke="#db2777" strokeWidth="0.8"/>
        <path d="M44 20 Q45 17 47 20" fill="none" stroke="#db2777" strokeWidth="1"/>
      </g>

      {/* ANAK */}
      <g className="kid-bob">
        <circle cx="78" cy="16" r="4.2" fill="#fbbf24"/>
        <path d="M74 14 Q75 9 78 13 Q81 9 82 14" fill="#92400e"/>
        <circle cx="75.5" cy="17.5" r="1.2" fill="#fca5a5" opacity="0.7"/>
        <circle cx="80.5" cy="17.5" r="1.2" fill="#fca5a5" opacity="0.7"/>
        <rect x="74.5" y="20" width="7" height="8" rx="2.5" fill="#10b981"/>
        <line x1="74.5" y1="24" x2="81.5" y2="24" stroke="#059669" strokeWidth="1"/>
        <g className="kid-armB"><rect x="80" y="21" width="2" height="6" rx="1" fill="#fbbf24" transform="rotate(8,81,21)"/></g>
        <g className="kid-legB"><rect x="78" y="28" width="2.5" height="7" rx="1.2" fill="#065f46"/><rect x="78" y="34" width="3.5" height="2" rx="1" fill="#065f46"/></g>
        <g className="kid-legF"><rect x="75.5" y="28" width="2.5" height="7" rx="1.2" fill="#047857"/><rect x="73" y="34" width="3.5" height="2" rx="1" fill="#047857"/></g>
        <g className="kid-armF"><rect x="72" y="21" width="2" height="6" rx="1" fill="#fbbf24" transform="rotate(-8,73,21)"/></g>
        <g className="kid-balloon">
          <line x1="79" y1="20" x2="80" y2="8" stroke="#f472b6" strokeWidth="0.8"/>
          <circle cx="80" cy="6" r="4.5" fill="#f472b6" opacity="0.9"/>
          <ellipse cx="78.5" cy="4.5" rx="1.2" ry="0.8" fill="white" opacity="0.4"/>
          <path d="M78 10.5 Q80 12 82 10.5" fill="#ec4899" stroke="none"/>
        </g>
      </g>
    </svg>
  );
}