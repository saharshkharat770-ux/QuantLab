import React, { useState, useId } from 'react'
import { TrendingUp, Maximize2, Minimize2 } from 'lucide-react'
import { HISTORICAL_PERFORMANCE_2024 } from '../../data/demo/historical'
import { useApp } from '../../context/AppContext'

export const PerformanceChart: React.FC = () => {
  const { benchmark, setBenchmark } = useApp()
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const rawId = useId()
  const uid = rawId.replace(/:/g, '')

  const data = HISTORICAL_PERFORMANCE_2024
  const n = data.length

  // Default active tooltip is Aug 14, 2024 (matching reference photo)
  const aug14Idx = data.findIndex((d) => d.date === '2024-08-14')
  const activeIdx = hoverIndex !== null ? hoverIndex : aug14Idx >= 0 ? aug14Idx : Math.floor(n * 0.75)
  const activePoint = data[activeIdx] || data[n - 1]

  // Chart bounds & scales
  const minY = -10
  const maxY = 40
  const yRange = maxY - minY // 50

  const svgWidth = 850
  const svgHeight = 280
  const padLeft = 45
  const padRight = 20
  const padTop = 20
  const padBottom = 35

  const plotW = svgWidth - padLeft - padRight
  const plotH = svgHeight - padTop - padBottom

  const getX = (idx: number) => padLeft + (idx / (n - 1)) * plotW
  const getY = (val: number) => padTop + plotH - ((val - minY) / yRange) * plotH

  // Build SVG paths
  const portfolioPoints = data.map((d, i) => `${getX(i)},${getY(d.portfolioReturnPercent)}`)
  const benchmarkPoints = data.map((d, i) => `${getX(i)},${getY(d.benchmarkReturnPercent)}`)

  const portfolioLine = `M ${portfolioPoints.join(' L ')}`
  const benchmarkLine = `M ${benchmarkPoints.join(' L ')}`

  const portfolioArea = `M ${getX(0)},${getY(0)} L ${portfolioPoints.join(' L ')} L ${getX(n - 1)},${getY(0)} Z`
  const benchmarkArea = `M ${getX(0)},${getY(0)} L ${benchmarkPoints.join(' L ')} L ${getX(n - 1)},${getY(0)} Z`

  // Month labels for X-axis
  const monthLabels = [
    { label: 'Jan 2024', idx: 0 },
    { label: 'Feb 2024', idx: 22 },
    { label: 'Mar 2024', idx: 43 },
    { label: 'Apr 2024', idx: 65 },
    { label: 'May 2024', idx: 87 },
    { label: 'Jun 2024', idx: 108 },
    { label: 'Jul 2024', idx: 130 },
    { label: 'Aug 2024', idx: 152 },
    { label: 'Sep 2024', idx: 174 },
    { label: 'Oct 2024', idx: 195 },
  ]

  // Y-axis grid ticks
  const yTicks = [-10, 0, 10, 20, 30, 40]

  return (
    <div
      className={`rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel flex flex-col justify-between transition-all ${
        isExpanded ? 'fixed inset-6 z-50 bg-background-surface/98 backdrop-blur-xl' : ''
      }`}
    >
      {/* Top Header / Legend / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-cyan/15 flex items-center justify-center text-brand-cyan">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-content-primary">Portfolio Performance</h3>
          </div>

          {/* Legends with live returns matching reference */}
          <div className="flex items-center gap-4 text-xs font-semibold pl-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan shadow-glow-cyan" />
              <span className="text-content-secondary">Portfolio</span>
              <span className="text-brand-cyan tabular-nums">+26.4%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
              <span className="text-content-secondary">{benchmark} (Benchmark)</span>
              <span className="text-brand-blue tabular-nums">+18.7%</span>
            </div>
          </div>
        </div>

        {/* Benchmark Selector & Expand Toggle */}
        <div className="flex items-center gap-2">
          <select
            value={benchmark}
            onChange={(e) => setBenchmark(e.target.value)}
            className="text-xs font-semibold bg-background-elevated border border-border text-content-secondary px-2.5 py-1 rounded-lg focus:outline-none focus:border-brand-cyan cursor-pointer"
          >
            <option value="S&P 500">vs S&P 500</option>
            <option value="NASDAQ">vs NASDAQ</option>
            <option value="NIFTY 50">vs NIFTY 50</option>
          </select>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-background-hover transition"
            title={isExpanded ? 'Exit Fullscreen' : 'Expand Chart'}
            aria-label="Toggle chart size"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SVG Time Series Chart */}
      <div className="relative mt-4 w-full h-[280px]">
        <svg
          className="w-full h-full overflow-visible select-none"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const relX = (mouseX / rect.width) * svgWidth - padLeft
            const idx = Math.max(0, Math.min(n - 1, Math.round((relX / plotW) * (n - 1))))
            setHoverIndex(idx)
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id={`gradPortfolio_${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id={`gradBench_${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#168BFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#168BFF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tick) => {
            const y = getY(tick)
            const isZero = tick === 0
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke={isZero ? '#243D57' : '#142538'}
                  strokeWidth={isZero ? 1.5 : 1}
                  strokeDasharray={isZero ? undefined : '3,3'}
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#7186A3"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  className="tabular-nums"
                >
                  {tick > 0 ? `+${tick}%` : `${tick}%`}
                </text>
              </g>
            )
          })}

          {/* X-Axis Month Labels */}
          {monthLabels.map((m) => {
            const x = getX(m.idx)
            return (
              <text
                key={m.label}
                x={x}
                y={svgHeight - 10}
                textAnchor="middle"
                fill="#7186A3"
                fontSize="10"
                fontFamily="Inter, sans-serif"
              >
                {m.label}
              </text>
            )
          })}

          {/* Area Fills */}
          <path d={portfolioArea} fill={`url(#gradPortfolio_${uid})`} />
          <path d={benchmarkArea} fill={`url(#gradBench_${uid})`} />

          {/* Benchmark Line (Blue) */}
          <path
            d={benchmarkLine}
            fill="none"
            stroke="#168BFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Portfolio Line (Cyan) */}
          <path
            d={portfolioLine}
            fill="none"
            stroke="#22D3EE"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Hover Crosshair Line */}
          {activePoint && (
            <g>
              <line
                x1={getX(activeIdx)}
                y1={padTop}
                x2={getX(activeIdx)}
                y2={padTop + plotH}
                stroke="#22D3EE"
                strokeWidth="1.25"
                strokeDasharray="4,4"
                strokeOpacity="0.8"
              />

              {/* Point on Benchmark */}
              <circle
                cx={getX(activeIdx)}
                cy={getY(activePoint.benchmarkReturnPercent)}
                r="4.5"
                fill="#168BFF"
                stroke="#0A1524"
                strokeWidth="2"
              />

              {/* Point on Portfolio */}
              <circle
                cx={getX(activeIdx)}
                cy={getY(activePoint.portfolioReturnPercent)}
                r="5"
                fill="#22D3EE"
                stroke="#0A1524"
                strokeWidth="2"
                filter="drop-shadow(0 0 6px rgba(34,211,238,0.8))"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip matching the reference: "Aug 14, 2024 / Portfolio +28.3% ($232,420) / S&P 500 +19.1%" */}
        {activePoint && (
          <div
            className="absolute pointer-events-none rounded-lg border border-border/80 bg-background-elevated/95 p-2.5 shadow-xl backdrop-blur-md text-xs z-10 transition-transform duration-75"
            style={{
              left: `${Math.min(75, Math.max(15, (activeIdx / (n - 1)) * 100))}%`,
              top: '15px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-[11px] font-semibold text-content-muted">
              {new Date(activePoint.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-brand-cyan">
                <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                <span>Portfolio</span>
                <span className="tabular-nums">
                  +{activePoint.portfolioReturnPercent}% (${activePoint.portfolioValue.toLocaleString()})
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-brand-blue">
                <span className="w-2 h-2 rounded-full bg-brand-blue" />
                <span>{benchmark}</span>
                <span className="tabular-nums">+{activePoint.benchmarkReturnPercent}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
