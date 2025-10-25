import React from "react";

export type DosePoint = { x: number; y: number };

export type DoseResponseChartProps = {
  data: DosePoint[];
  className?: string;
};

// Simple SVG line chart (log-like x spacing), avoiding extra deps for now
export default function DoseResponseChart({ data, className = "" }: DoseResponseChartProps) {
  const width = 560;
  const height = 220;
  const padding = 32;

  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = 0;
  const yMax = Math.max(1, Math.max(...ys));

  const xScale = (x: number) => {
    const t = (Math.log10(x) - Math.log10(xMin)) / (Math.log10(xMax) - Math.log10(xMin));
    return padding + t * (width - 2 * padding);
  };
  const yScale = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

  const path = data
    .sort((a, b) => a.x - b.x)
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.x)},${yScale(d.y)}`)
    .join(' ');

  const ticks = [xMin, xMin * 10 ** 1, xMin * 10 ** 2, xMax].filter((v, i, arr) => v <= xMax && v >= xMin && (i === 0 || v !== arr[i - 1]));

  return (
    <div className={`bg-axiom-bg-card-white rounded-2xl border border-axiom-border-light p-4 ${className}`}>
      <svg width={width} height={height}>
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--axiom-border-light)" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--axiom-border-light)" />

        {/* X ticks (log scale labels) */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={xScale(t)} y1={height - padding} x2={xScale(t)} y2={height - padding + 6} stroke="var(--axiom-border-light)" />
            <text x={xScale(t)} y={height - padding + 18} fontSize={10} textAnchor="middle" fill="var(--axiom-text-secondary)">{t.toPrecision(2)} μM</text>
          </g>
        ))}

        {/* Y ticks */}
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line x1={padding - 6} y1={yScale(t)} x2={padding} y2={yScale(t)} stroke="var(--axiom-border-light)" />
            <text x={padding - 10} y={yScale(t) + 3} fontSize={10} textAnchor="end" fill="var(--axiom-text-secondary)">{t.toFixed(1)}</text>
          </g>
        ))}

        {/* Curve */}
        <g className="text-axiom-graph-blue">
          <path d={path} fill="none" stroke="currentColor" strokeWidth={2} />
        </g>

        {/* Points */}
        <g className="text-axiom-graph-blue">
          {data.map((d, i) => (
            <circle key={i} cx={xScale(d.x)} cy={yScale(d.y)} r={3} fill="currentColor" />
          ))}
        </g>
      </svg>
      <div className="mt-2 text-xs text-axiom-text-secondary">Dose-Response (log concentration vs normalized response)</div>
    </div>
  );
}


