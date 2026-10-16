type SignalMapProps = {
  className?: string;
};

const lines = [
  [8, 84, 124, 48],
  [24, 28, 112, 68],
  [72, 8, 132, 112],
  [4, 56, 144, 52],
  [18, 122, 96, 18],
  [104, 18, 142, 132],
  [42, 134, 134, 76],
  [12, 104, 72, 8],
];

const points = [
  [8, 84, "red"],
  [24, 28, "yellow"],
  [72, 8, "blue"],
  [124, 48, "teal"],
  [112, 68, "red"],
  [132, 112, "yellow"],
  [96, 18, "teal"],
  [42, 134, "blue"],
  [134, 76, "red"],
  [12, 104, "teal"],
];

export function SignalMap({ className = "" }: SignalMapProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 152 152"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="151" height="151" stroke="currentColor" strokeWidth="1" />
      {[16, 38, 60, 82, 104, 126, 144].map((mark) => (
        <g key={mark} opacity="0.32">
          <path d={`M${mark} 0V152`} stroke="currentColor" strokeWidth="0.5" />
          <path d={`M0 ${mark}H152`} stroke="currentColor" strokeWidth="0.5" />
        </g>
      ))}
      {lines.map(([x1, y1, x2, y2], index) => (
        <path key={index} d={`M${x1} ${y1}L${x2} ${y2}`} className="signal-map-line" />
      ))}
      {points.map(([cx, cy, tone], index) => (
        <g key={`${cx}-${cy}-${index}`}>
          <circle cx={cx} cy={cy} r="5.5" className={`signal-map-ring signal-map-ring--${tone}`} />
          <circle cx={cx} cy={cy} r="1.8" className={`signal-map-dot signal-map-dot--${tone}`} />
        </g>
      ))}
      <path d="M0 151.5H152" stroke="currentColor" strokeWidth="1" />
      <path d="M151.5 0V152" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
