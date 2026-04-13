import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Area, ComposedChart,
} from 'recharts';

function CustomTooltip({ active, payload, label, xLabel, yLabel }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const xValue = data.distance !== undefined ? data.distance :
                 (data.frequency_thz !== undefined ? data.frequency_thz : label);
  const yValue = data.power !== undefined ? data.power :
                 (data.psd_dbm_hz !== undefined ? data.psd_dbm_hz : payload[0].value);

  const xUnit = xLabel.includes('km') ? 'km' : (xLabel.includes('THz') ? 'THz' : '');
  const yUnit = yLabel.includes('dBm') ? 'dBm' : '';

  return (
    <div className="glass-panel-strong p-3 !border-neon-cyan/20 shadow-lg z-50">
      <p className="text-xs font-mono text-neon-cyan mb-1">
        📍 {typeof xValue === 'number' ? xValue.toFixed(4) : xValue} {xUnit}
      </p>
      <p className="text-sm font-semibold text-white">
        {typeof yValue === 'number' ? yValue.toFixed(2) : yValue} {yUnit}
      </p>
      {data.label && (
        <p className="text-[10px] text-slate-400 mt-1">{data.label}</p>
      )}
    </div>
  );
}

export default function PowerChart({
  data,
  sensitivity,
  title = "📉 Puissance Optique vs Distance",
  xKey = "distance",
  yKey = "power",
  xLabel = "Distance (km)",
  yLabel = "Puissance (dBm)",
  yDomain = "auto",
  color = "#06d6e0"
}) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 flex items-center justify-center h-full min-h-[250px]">
        <p className="text-xs text-slate-600">
          {title.includes('Spectrale')
            ? "En attente du calcul backend..."
            : "Ajoutez des composants pour voir le graphique"}
        </p>
      </div>
    );
  }

  // For the power budget chart, deduplicate points at the same distance by
  // keeping only the LAST value (i.e. after component loss), so we get a
  // clean monotone curve instead of vertical staircase jumps.
  const isPowerChart = xKey === 'distance';
  const plotData = isPowerChart
    ? (() => {
        const seen = new Map();
        // Two passes: collect "after" point for each distance (last wins)
        data.forEach(pt => seen.set(pt[xKey], pt));
        return Array.from(seen.values()).sort((a, b) => a[xKey] - b[xKey]);
      })()
    : data;

  const allX = plotData.map(d => d[xKey]);
  const maxX = Math.max(...allX, 1);

  const allY = plotData.map(d => d[yKey]);
  if (sensitivity !== undefined) allY.push(sensitivity);
  let minY = Math.min(...allY) - 3;
  let maxY = Math.max(...allY) + 3;

  if (minY === Infinity) minY = -100;
  if (maxY === -Infinity) maxY = 0;

  // Power chart uses monotone for a smooth budget curve;
  // spectral chart uses linear to faithfully render the sharp peak.
  const lineType = isPowerChart ? "monotone" : "linear";

  return (
    <div className="glass-panel p-3 glow-cyan h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className="text-xs font-semibold text-slate-300">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-[9px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 rounded-full inline-block" style={{ backgroundColor: color }} />
            <span className="text-slate-500">Signal</span>
          </span>
          {sensitivity !== undefined && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 inline-block"
                style={{ borderTop: '1px dashed #ef4444', height: 0, width: 12 }}
              />
              <span className="text-slate-500">Sensibilité</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={plotData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${xKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 6"
              stroke="rgba(42, 42, 64, 0.5)"
              vertical={false}
            />

            <XAxis
              dataKey={xKey}
              type="number"
              domain={isPowerChart ? [0, maxX] : ['auto', 'auto']}
              tickCount={isPowerChart ? 8 : 5}
              axisLine={{ stroke: '#2a2a40' }}
              tickLine={{ stroke: '#2a2a40' }}
              tickFormatter={(val) =>
                Number.isInteger(val) ? val : parseFloat(val).toFixed(2)
              }
              label={{
                value: xLabel,
                position: 'insideBottomRight',
                offset: -5,
                style: { fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' },
              }}
            />

            <YAxis
              domain={yDomain === 'auto' ? [minY, maxY] : yDomain}
              axisLine={{ stroke: '#2a2a40' }}
              tickLine={{ stroke: '#2a2a40' }}
              tickFormatter={(val) => parseInt(val)}
              label={{
                value: yLabel,
                angle: -90,
                position: 'insideLeft',
                offset: 5,
                style: { fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' },
              }}
            />

            <Tooltip content={<CustomTooltip xLabel={xLabel} yLabel={yLabel} />} />

            {sensitivity !== undefined && (
              <ReferenceLine
                y={sensitivity}
                stroke="#ef4444"
                strokeDasharray="6 4"
                strokeWidth={1.5}
                label={{
                  value: `Sensibilité: ${sensitivity} dBm`,
                  position: 'right',
                  style: { fill: '#ef4444', fontSize: 10, fontFamily: 'JetBrains Mono' },
                }}
              />
            )}

            <Area
              type={lineType}
              dataKey={yKey}
              fill={`url(#gradient-${xKey})`}
              stroke="none"
              isAnimationActive={false}
            />

            <Line
              type={lineType}
              dataKey={yKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              activeDot={{
                r: 4,
                fill: color,
                stroke: '#0a0a0f',
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}