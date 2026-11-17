const nodes = [
  { label: "VoIP", x: 200, y: 38 },
  { label: "NETWORK", x: 380, y: 198 },
  { label: "DEVOPS", x: 200, y: 358 },
  { label: "AUTOMATION", x: 20, y: 198 },
] as const;

export function HeroDiagram() {
  return (
    <svg
      viewBox="0 0 520 440"
      role="img"
      aria-label="نمودار ارتباط حوزه‌های خدمات DAAL OPS: VoIP، شبکه، DevOps و اتوماسیون"
      className="h-auto w-full max-w-[520px]"
    >
      <circle
        cx="260"
        cy="220"
        r="190"
        fill="none"
        stroke="rgba(56,212,234,0.18)"
        strokeDasharray="2 8"
      />
      <circle
        cx="260"
        cy="220"
        r="120"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
      />
      <circle
        cx="260"
        cy="220"
        r="70"
        fill="none"
        stroke="rgba(56,212,234,0.5)"
        className="soft-pulse"
      />

      <g stroke="rgba(56,212,234,0.7)" strokeWidth="1.5" fill="none">
        <path d="M260 176V82" className="flow-line" />
        <path d="M304 220H380" className="flow-line" />
        <path d="M260 264V358" className="flow-line" />
        <path d="M216 220H140" className="flow-line" />
      </g>

      <circle
        cx="260"
        cy="220"
        r="44"
        fill="#0f1a2e"
        stroke="rgba(56,212,234,0.6)"
        strokeWidth="1.5"
      />
      <text
        x="260"
        y="216"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="13"
        fontWeight="600"
      >
        DAAL
      </text>
      <text
        x="260"
        y="234"
        textAnchor="middle"
        fill="#38d4ea"
        fontSize="13"
        fontWeight="600"
      >
        OPS
      </text>

      {nodes.map((node) => (
        <g key={node.label}>
          <rect
            x={node.x}
            y={node.y}
            width="120"
            height="44"
            rx="12"
            fill="#09111f"
            stroke="rgba(255,255,255,0.14)"
          />
          <text
            x={node.x + 60}
            y={node.y + 27}
            textAnchor="middle"
            fill="#e6edf6"
            fontSize="12"
            fontWeight="500"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}