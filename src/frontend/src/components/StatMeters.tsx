import React, { useId } from "react";

// ─── HeartGem ─────────────────────────────────────────────────────────────────
// Jewel-cut heart built from SVG path facets.
// Water-fill clipPath rises with HP percentage.
interface HeartGemProps {
  currentHp: number;
  maxHp: number;
}

export function HeartGem({ currentHp, maxHp }: HeartGemProps) {
  const uid = useId().replace(/:/g, "");
  const pct = Math.max(0, Math.min(1, maxHp > 0 ? currentHp / maxHp : 0));

  // Heart SVG path — classic heart centred on (40,38) in a 80×80 viewBox.
  // Outer silhouette used for clip + fill.
  const heartPath =
    "M40,62 C40,62 10,44 10,26 C10,16 18,10 27,12 C32,13 37,17 40,22 C43,17 48,13 53,12 C62,10 70,16 70,26 C70,44 40,62 40,62 Z";

  // Facet lines — inner geometry to give gem cut appearance.
  // Centre point of heart
  const cx = 40;
  const cy = 35;

  // Key heart silhouette anchor points for facets
  const facetLines = [
    // from centre to upper-left lobe tip
    [cx, cy, 18, 20],
    // from centre to upper-right lobe tip
    [cx, cy, 62, 20],
    // from centre to bottom tip
    [cx, cy, 40, 62],
    // from centre to left side
    [cx, cy, 10, 30],
    // from centre to right side
    [cx, cy, 70, 30],
    // horizontal across top of lobes
    [20, 18, 40, 22],
    [40, 22, 60, 18],
  ] as [number, number, number, number][];

  // Water-fill clip: a rect that starts at the bottom and rises to (1-pct) offset
  const waterY = 64 - pct * 52; // range from 64 (empty) to 12 (full)

  return (
    <div className="stat-gem-heart-overflow" data-ocid="stat.hp_meter">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        overflow="visible"
        aria-label={`HP: ${currentHp} / ${maxHp}`}
        role="img"
      >
        <defs>
          {/* Faceted gem gradient */}
          <radialGradient
            id={`hpGrad-${uid}`}
            cx="40%"
            cy="35%"
            r="60%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="oklch(0.42 0.22 29)" />
            <stop offset="45%" stopColor="oklch(0.28 0.18 15)" />
            <stop offset="100%" stopColor="oklch(0.12 0.12 5)" />
          </radialGradient>

          {/* Water fill gradient */}
          <linearGradient id={`hpWater-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="oklch(0.52 0.25 29)"
              stopOpacity="0.9"
            />
            <stop
              offset="100%"
              stopColor="oklch(0.38 0.2 15)"
              stopOpacity="0.75"
            />
          </linearGradient>

          {/* Clip to heart shape */}
          <clipPath id={`heartClip-${uid}`}>
            <path d={heartPath} />
          </clipPath>

          {/* Rising water clip rect */}
          <clipPath id={`waterClip-${uid}`}>
            <rect x="0" y={waterY} width="80" height="80" />
          </clipPath>

          {/* Inner highlight gradient */}
          <linearGradient
            id={`hpHighlight-${uid}`}
            x1="0"
            y1="0"
            x2="0.3"
            y2="0.4"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base heart fill — faceted gem */}
        <path
          d={heartPath}
          fill={`url(#hpGrad-${uid})`}
          stroke="oklch(0.55 0.28 29)"
          strokeWidth="1.5"
        />

        {/* Facet lines */}
        {facetLines.map(([x1, y1, x2, y2], i) => (
          <line
            // biome-ignore lint/suspicious/noArrayIndexKey: static facet geometry never reorders
            key={`facet-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="oklch(0.65 0.22 29)"
            strokeWidth="0.6"
            strokeOpacity="0.45"
            clipPath={`url(#heartClip-${uid})`}
          />
        ))}

        {/* Water fill layer */}
        <rect
          x="0"
          y="0"
          width="80"
          height="80"
          fill={`url(#hpWater-${uid})`}
          clipPath={`url(#heartClip-${uid})`}
          style={{ clipPath: `url(#waterClip-${uid})` }}
        />

        {/* Water surface shimmer line */}
        <line
          x1="12"
          y1={waterY}
          x2="68"
          y2={waterY}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
          clipPath={`url(#heartClip-${uid})`}
        />

        {/* Highlight sheen */}
        <path
          d={heartPath}
          fill={`url(#hpHighlight-${uid})`}
          pointerEvents="none"
        />

        {/* Outer glow ring */}
        <path
          d={heartPath}
          fill="none"
          stroke="oklch(0.62 0.28 29)"
          strokeWidth="2.5"
          strokeOpacity="0.5"
          filter="url(none)"
        />
      </svg>

      {/* HP text below */}
      <div className="stat-gem-label">
        <span
          className="stat-gem-value"
          style={{ color: "oklch(0.88 0.12 29)" }}
        >
          {currentHp}
        </span>
        <span className="stat-gem-sep">/</span>
        <span className="stat-gem-max">{maxHp}</span>
      </div>
    </div>
  );
}

// ─── StarBadge (AP) ───────────────────────────────────────────────────────────
interface StarBadgeProps {
  value: number;
  maxValue?: number;
}

export function StarBadge({ value, maxValue }: StarBadgeProps) {
  const uid = useId().replace(/:/g, "");

  // Compute 5-pointed star polygon — outer radius 29, inner radius 12, centred 30,30
  const outerR = 29;
  const innerR = 12;
  const cx = 30;
  const cy = 30;
  const points: string[] = [];

  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI / 180) * (-90 + i * 72);
    const innerAngle = (Math.PI / 180) * (-90 + 36 + i * 72);
    points.push(
      `${cx + outerR * Math.cos(outerAngle)},${cy + outerR * Math.sin(outerAngle)}`,
    );
    points.push(
      `${cx + innerR * Math.cos(innerAngle)},${cy + innerR * Math.sin(innerAngle)}`,
    );
  }
  const polyPoints = points.join(" ");

  return (
    <div className="stat-gem-badge" data-ocid="stat.ap_meter">
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        overflow="visible"
        aria-label={`AP: ${value}${maxValue !== undefined ? ` / ${maxValue}` : ""}`}
        role="img"
      >
        <defs>
          <radialGradient
            id={`apGrad-${uid}`}
            cx="38%"
            cy="32%"
            r="58%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="oklch(0.62 0.2 262)" />
            <stop offset="50%" stopColor="oklch(0.45 0.18 262)" />
            <stop offset="100%" stopColor="oklch(0.18 0.1 262)" />
          </radialGradient>
          <linearGradient
            id={`apHighlight-${uid}`}
            x1="0"
            y1="0"
            x2="0.4"
            y2="0.4"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter
            id={`apGlow-${uid}`}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow backdrop */}
        <polygon
          points={polyPoints}
          fill="oklch(0.55 0.18 262 / 0.25)"
          filter={`url(#apGlow-${uid})`}
          transform="scale(1.12) translate(-2.8,-2.8)"
        />

        {/* Star body */}
        <polygon
          points={polyPoints}
          fill={`url(#apGrad-${uid})`}
          stroke="oklch(0.62 0.2 262)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Highlight */}
        <polygon
          points={polyPoints}
          fill={`url(#apHighlight-${uid})`}
          pointerEvents="none"
        />

        {/* AP number */}
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="bold"
          fill="white"
          fontFamily="var(--font-display)"
          style={{ textShadow: "0 1px 4px rgba(0,0,40,0.7)" }}
        >
          {value}
        </text>
      </svg>
      <div
        className="stat-gem-badge-label"
        style={{ color: "oklch(0.72 0.15 262)" }}
      >
        AP
      </div>
    </div>
  );
}

// ─── DiamondBadge (MP) ────────────────────────────────────────────────────────
interface DiamondBadgeProps {
  value: number;
  maxValue?: number;
}

export function DiamondBadge({ value, maxValue }: DiamondBadgeProps) {
  const uid = useId().replace(/:/g, "");

  // Rhombus: top/bottom further apart (±28 on Y), left/right closer (±21 on X), centred 30,30
  const pts = [
    "30,2", // top
    "51,30", // right
    "30,58", // bottom
    "9,30", // left
  ].join(" ");

  // Inner facet lines for gem look
  const facets = [
    { x1: 30, y1: 2, x2: 30, y2: 58 }, // vertical axis
    { x1: 9, y1: 30, x2: 51, y2: 30 }, // horizontal axis
    { x1: 30, y1: 2, x2: 51, y2: 30 }, // top-right
    { x1: 30, y1: 2, x2: 9, y2: 30 }, // top-left
    { x1: 30, y1: 15, x2: 45, y2: 30 }, // inner top-right facet
    { x1: 30, y1: 15, x2: 15, y2: 30 }, // inner top-left facet
  ];

  return (
    <div className="stat-gem-badge" data-ocid="stat.mp_meter">
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        overflow="visible"
        aria-label={`MP: ${value}${maxValue !== undefined ? ` / ${maxValue}` : ""}`}
        role="img"
      >
        <defs>
          <radialGradient
            id={`mpGrad-${uid}`}
            cx="38%"
            cy="30%"
            r="58%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="oklch(0.60 0.22 150)" />
            <stop offset="50%" stopColor="oklch(0.42 0.18 150)" />
            <stop offset="100%" stopColor="oklch(0.16 0.1 150)" />
          </radialGradient>
          <linearGradient
            id={`mpHighlight-${uid}`}
            x1="0"
            y1="0"
            x2="0.4"
            y2="0.4"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter
            id={`mpGlow-${uid}`}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id={`mpClip-${uid}`}>
            <polygon points={pts} />
          </clipPath>
        </defs>

        {/* Glow backdrop */}
        <polygon
          points={pts}
          fill="oklch(0.52 0.2 150 / 0.25)"
          filter={`url(#mpGlow-${uid})`}
          transform="scale(1.1) translate(-2.7,-2.7)"
        />

        {/* Diamond body */}
        <polygon
          points={pts}
          fill={`url(#mpGrad-${uid})`}
          stroke="oklch(0.60 0.22 150)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Facet lines */}
        {facets.map((f, i) => (
          <line
            // biome-ignore lint/suspicious/noArrayIndexKey: static facet geometry never reorders
            key={`facet-${i}`}
            x1={f.x1}
            y1={f.y1}
            x2={f.x2}
            y2={f.y2}
            stroke="oklch(0.72 0.18 150)"
            strokeWidth="0.6"
            strokeOpacity="0.4"
            clipPath={`url(#mpClip-${uid})`}
          />
        ))}

        {/* Highlight */}
        <polygon
          points={pts}
          fill={`url(#mpHighlight-${uid})`}
          pointerEvents="none"
        />

        {/* MP number */}
        <text
          x="30"
          y="35"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="bold"
          fill="white"
          fontFamily="var(--font-display)"
        >
          {value}
        </text>
      </svg>
      <div
        className="stat-gem-badge-label"
        style={{ color: "oklch(0.72 0.18 150)" }}
      >
        MP
      </div>
    </div>
  );
}

// ─── StatPanel ────────────────────────────────────────────────────────────────
// Combined panel: HeartGem overflowing at top, AP star + MP diamond below.
interface StatPanelProps {
  hp: number;
  maxHp: number; // C3 fix: MUST be the character's computed maxHp (100 * (1 + (level-1)*0.05)), NOT 100
  ap: number;
  maxAp: number; // H6 fix: MUST be characterStats.ap (the actual AP stat, which grows +1 every 25 levels), NOT 6
  mp: number;
  maxMp: number; // H6 fix: MUST be characterStats.mp (the actual MP stat, which grows +1 every 25 levels), NOT 4
}

export function StatPanel({ hp, maxHp, ap, maxAp, mp, maxMp }: StatPanelProps) {
  // All three maxima MUST be the live stat values from the character — never hardcoded.
  return (
    <div className="stat-gem-panel" data-ocid="stat.panel">
      {/* Heart overflows top of panel */}
      <div className="stat-gem-heart-overflow">
        <HeartGem currentHp={hp} maxHp={maxHp} />
      </div>

      {/* AP + MP row */}
      <div className="stat-gem-badge-row">
        <StarBadge value={ap} maxValue={maxAp} />
        <DiamondBadge value={mp} maxValue={maxMp} />
      </div>
    </div>
  );
}
