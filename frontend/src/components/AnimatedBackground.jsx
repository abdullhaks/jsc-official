import React from 'react';

// Soft, GPU-friendly animated SVG background.
// Uses CSS animations only (no JS frame updates) for optimal performance.
const AnimatedBackground = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none w-full h-full overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="bg-grad-1" cx="20%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f0fdf4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bg-grad-2" cx="80%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#ccfbf1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f0fdf4" stopOpacity="0" />
          </radialGradient>

          <style>{`
            @media (prefers-reduced-motion: no-preference) {
              .bg-blob-1 { animation: blob-drift-1 24s ease-in-out infinite alternate; }
              .bg-blob-2 { animation: blob-drift-2 30s ease-in-out infinite alternate; }
              .bg-blob-3 { animation: blob-drift-3 20s ease-in-out infinite alternate; }
              .bg-pattern { animation: pattern-slide 60s linear infinite; }
            }
            @keyframes blob-drift-1 {
              from { transform: translate(0px, 0px) scale(1); }
              to   { transform: translate(40px, 30px) scale(1.08); }
            }
            @keyframes blob-drift-2 {
              from { transform: translate(0px, 0px) scale(1); }
              to   { transform: translate(-50px, -25px) scale(1.05); }
            }
            @keyframes blob-drift-3 {
              from { transform: translate(0px, 0px); opacity: 0.06; }
              to   { transform: translate(20px, -20px); opacity: 0.1; }
            }
            @keyframes pattern-slide {
              from { transform: translate(0, 0); }
              to   { transform: translate(80px, 80px); }
            }
          `}</style>
        </defs>

        {/* Soft ambient blobs */}
        <ellipse className="bg-blob-1" cx="15%" cy="20%" rx="40%" ry="35%" fill="url(#bg-grad-1)" />
        <ellipse className="bg-blob-2" cx="85%" cy="80%" rx="45%" ry="38%" fill="url(#bg-grad-2)" />

        {/* Subtle geometric pattern - very low opacity */}
        <g className="bg-blob-3" style={{ transformOrigin: '50% 50%' }}>
          <rect
            className="bg-pattern"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            fill="none"
            stroke="#34d399"
            strokeWidth="0.3"
            strokeOpacity="0.08"
            strokeDasharray="4 20"
          />
        </g>

        {/* Static Islamic star shapes (no animation — purely decorative) */}
        {[
          { cx: '10%', cy: '15%', r: 3 },
          { cx: '92%', cy: '10%', r: 2 },
          { cx: '5%',  cy: '75%', r: 2.5 },
          { cx: '95%', cy: '70%', r: 2 },
          { cx: '50%', cy: '5%',  r: 1.5 },
          { cx: '50%', cy: '95%', r: 1.5 },
        ].map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#059669" opacity="0.08" />
        ))}
      </svg>
    </div>
  );
};

export default AnimatedBackground;
