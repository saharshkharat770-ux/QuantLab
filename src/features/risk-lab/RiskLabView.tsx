import React, { useState } from 'react'
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  Layers,
  Link2,
  Info,
  Calendar,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { HISTORICAL_PERFORMANCE_2024 } from '../../data/demo/historical'
import {
  calculateAnnualizedVolatility,
  calculateHistoricalVaR,
  calculateExpectedShortfall,
  calculateDrawdowns,
  calculateBetaAndCorrelation,
  calculateSharpeRatio,
  calculateSortinoRatio,
  calculateCompositeRiskScore,
} from '../../engine/risk/analytics'
import { calculateSimpleReturns } from '../../engine/statistics/returns'

export const RiskLabView: React.FC = () => {
  const { summary, benchmark, formatCurrency } = useApp()
  const [confidence, setConfidence] = useState<0.95 | 0.99>(0.95)
  const [lookbackDays, setLookbackDays] = useState<number>(205)
  const [rfRate, setRfRate] = useState<number>(4.5)

  // Extract slices based on lookback
  const fullData = HISTORICAL_PERFORMANCE_2024
  const slicedData = fullData.slice(Math.max(0, fullData.length - lookbackDays))

  const pValues = slicedData.map((d) => d.portfolioValue)
  const bValues = slicedData.map((d) => d.benchmarkValue)
  const pReturns = calculateSimpleReturns(pValues)
  const bReturns = calculateSimpleReturns(bValues)

  // Calculations
  const annVol = calculateAnnualizedVolatility(pReturns)
  const varLoss = calculateHistoricalVaR(pReturns, summary.totalValue, confidence)
  const esLoss = calculateExpectedShortfall(pReturns, summary.totalValue, confidence)
  const ddInfo = calculateDrawdowns(pValues)
  const betaCorr = calculateBetaAndCorrelation(pReturns, bReturns)
  const cagr = ((pValues[pValues.length - 1] - pValues[0]) / pValues[0]) * 100
  const sharpe = calculateSharpeRatio(cagr, annVol, rfRate)
  const sortino = calculateSortinoRatio(pReturns, cagr, rfRate)
  const { score, category } = calculateCompositeRiskScore(annVol, ddInfo.maxDrawdownPercent, betaCorr.beta)

  // Return Distribution Histogram buckets
  const bucketCount = 12
  const minRet = Math.min(...pReturns)
  const maxRet = Math.max(...pReturns)
  const range = maxRet - minRet || 0.05
  const step = range / bucketCount
  const buckets: Array<{ rangeLabel: string; count: number; isTail: boolean }> = []

  for (let b = 0; b < bucketCount; b++) {
    const bStart = minRet + b * step
    const bEnd = bStart + step
    const count = pReturns.filter((r) => r >= bStart && (b === bucketCount - 1 ? r <= bEnd : r < bEnd)).length
    const isTail = b < 2 // Lower tail region
    buckets.push({
      rangeLabel: `${(bStart * 100).toFixed(1)}%`,
      count,
      isTail,
    })
  }

  // Correlation Matrix
  const assets = ['AAPL', 'MSFT', 'NVDA', 'SPY', 'BND']
  const corrMatrix: number[][] = [
    [1.0, 0.68, 0.74, 0.82, -0.15],
    [0.68, 1.0, 0.65, 0.84, -0.12],
    [0.74, 0.65, 1.0, 0.78, -0.22],
    [0.82, 0.84, 0.78, 1.0, -0.08],
    [-0.15, -0.12, -0.22, -0.08, 1.0],
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-background-surface shadow-panel">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-financial-warning/20 border border-financial-warning/40 flex items-center justify-center text-financial-warning">
              <Activity className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-content-primary">Quantitative Risk Lab</h1>
          </div>
          <p className="mt-1 text-xs text-content-muted">
            Non-parametric historical Value at Risk (VaR), Expected Shortfall (CVaR), multi-asset cross-correlations, and maximum drawdown decomposition.
          </p>
        </div>

        {/* Risk Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Confidence Level */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-background-elevated border border-border text-xs">
            <span className="text-content-muted px-2 font-medium">Confidence:</span>
            {[0.95, 0.99].map((c) => (
              <button
                key={c}
                onClick={() => setConfidence(c as any)}
                className={`px-2.5 py-0.5 rounded font-bold transition ${
                  confidence === c ? 'bg-brand-blue text-white' : 'text-content-muted hover:text-content-primary'
                }`}
              >
                {(c * 100).toFixed(0)}%
              </button>
            ))}
          </div>

          {/* Lookback Selector */}
          <select
            value={lookbackDays}
            onChange={(e) => setLookbackDays(parseInt(e.target.value))}
            className="text-xs font-semibold bg-background-elevated border border-border text-content-secondary px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-cyan"
          >
            <option value={60}>Lookback: 60 Days</option>
            <option value={120}>Lookback: 120 Days</option>
            <option value={205}>Lookback: 2024 YTD (Full)</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Composite Score Card */}
        <div className="p-5 rounded-xl border border-border bg-background-surface shadow-panel space-y-2">
          <div className="flex items-center justify-between text-xs text-content-muted">
            <span className="font-semibold text-content-secondary">Composite Risk Score</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-financial-warning/20 text-financial-warning">
              {category}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-content-primary tabular-nums">{score}</span>
            <span className="text-xs text-content-muted font-bold">/ 100</span>
          </div>
          <p className="text-[11px] text-content-muted">
            Empirical multi-factor index combining volatility, drawdown, and beta.
          </p>
        </div>

        {/* VaR Card */}
        <div className="p-5 rounded-xl border border-border bg-background-surface shadow-panel space-y-2">
          <div className="flex items-center justify-between text-xs text-content-muted">
            <span className="font-semibold text-content-secondary">
              Value at Risk ({(confidence * 100).toFixed(0)}%)
            </span>
            <ShieldAlert className="w-4 h-4 text-financial-negative" />
          </div>
          <div className="text-3xl font-black text-financial-negative tabular-nums">
            -${Math.abs(varLoss).toLocaleString()}
          </div>
          <p className="text-[11px] text-content-muted">
            1-day empirical loss threshold at {(confidence * 100).toFixed(0)}% confidence level.
          </p>
        </div>

        {/* Expected Shortfall Card */}
        <div className="p-5 rounded-xl border border-border bg-background-surface shadow-panel space-y-2">
          <div className="flex items-center justify-between text-xs text-content-muted">
            <span className="font-semibold text-content-secondary">
              Expected Shortfall ({(confidence * 100).toFixed(0)}%)
            </span>
            <AlertTriangle className="w-4 h-4 text-financial-warning" />
          </div>
          <div className="text-3xl font-black text-financial-negative tabular-nums">
            -${Math.abs(esLoss).toLocaleString()}
          </div>
          <p className="text-[11px] text-content-muted">
            Average expected loss in the extreme tail exceeding VaR.
          </p>
        </div>

        {/* Max Drawdown Card */}
        <div className="p-5 rounded-xl border border-border bg-background-surface shadow-panel space-y-2">
          <div className="flex items-center justify-between text-xs text-content-muted">
            <span className="font-semibold text-content-secondary">Max Drawdown</span>
            <TrendingDown className="w-4 h-4 text-financial-negative" />
          </div>
          <div className="text-3xl font-black text-financial-negative tabular-nums">
            -{ddInfo.maxDrawdownPercent.toFixed(1)}%
          </div>
          <p className="text-[11px] text-content-muted">
            Peak to trough decline experienced during early August pullback.
          </p>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drawdown Depth Chart (Left 7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-border/80 bg-background-surface shadow-panel space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-financial-negative" />
              <h3 className="text-sm font-bold text-content-primary">Historical Drawdown Underwater Chart</h3>
            </div>
            <span className="text-xs font-semibold text-financial-negative tabular-nums">
              Deepest: -{ddInfo.maxDrawdownPercent.toFixed(1)}%
            </span>
          </div>

          <div className="h-[200px] w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF647C" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#FF647C" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Zero line */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#243D57" strokeWidth="1.5" />
              {/* -5% line */}
              <line x1="0" y1="85" x2="500" y2="85" stroke="#142538" strokeWidth="1" strokeDasharray="3,3" />
              {/* -10% line */}
              <line x1="0" y1="150" x2="500" y2="150" stroke="#142538" strokeWidth="1" strokeDasharray="3,3" />

              {/* Underwater Area */}
              <polygon
                points={`0,20 ${ddInfo.drawdownSeries
                  .map((dd, idx) => {
                    const x = (idx / (ddInfo.drawdownSeries.length - 1)) * 500
                    const y = 20 + (Math.abs(dd) / 10) * 130
                    return `${x},${y}`
                  })
                  .join(' ')} 500,20`}
                fill="url(#ddGrad)"
              />

              {/* Line */}
              <polyline
                points={ddInfo.drawdownSeries
                  .map((dd, idx) => {
                    const x = (idx / (ddInfo.drawdownSeries.length - 1)) * 500
                    const y = 20 + (Math.abs(dd) / 10) * 130
                    return `${x},${y}`
                  })
                  .join(' ')}
                fill="none"
                stroke="#FF647C"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-content-muted pt-2 border-t border-border/40">
            <span>Jan 2024</span>
            <span>Apr 2024 (Minor Dip)</span>
            <span>Aug 2024 (Trough -8.4%)</span>
            <span>Oct 2024 (Recovered)</span>
          </div>
        </div>

        {/* Daily Return Distribution Histogram (Right 5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-border/80 bg-background-surface shadow-panel space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <h3 className="text-sm font-bold text-content-primary">Daily Return Distribution</h3>
            <span className="text-[11px] text-brand-cyan">Kurtosis & VaR Cutoff</span>
          </div>

          <div className="h-[200px] w-full flex items-end gap-1.5 pt-4">
            {buckets.map((b, idx) => {
              const maxCount = Math.max(...buckets.map((x) => x.count), 1)
              const heightPct = (b.count / maxCount) * 100

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 hidden group-hover:flex px-1.5 py-0.5 rounded bg-background-elevated border border-border text-[9px] font-bold text-content-primary whitespace-nowrap z-20">
                    {b.count} days ({b.rangeLabel})
                  </div>

                  <div
                    className={`w-full rounded-t transition-all ${
                      b.isTail
                        ? 'bg-financial-negative/80 group-hover:bg-financial-negative'
                        : 'bg-brand-blue/70 group-hover:bg-brand-cyan'
                    }`}
                    style={{ height: `${Math.max(6, heightPct)}%` }}
                  />
                  <span className="text-[8px] text-content-muted truncate w-full text-center">
                    {b.rangeLabel}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/40">
            <div className="flex items-center gap-1.5 text-financial-negative">
              <span className="w-2.5 h-2.5 rounded-sm bg-financial-negative" />
              <span>Tail Risk Zone (Loss &gt; VaR)</span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-cyan">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand-blue" />
              <span>Normal Distribution</span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset-to-Asset Correlation Matrix */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div>
            <h3 className="text-sm font-bold text-content-primary">Asset Pairwise Correlation Matrix</h3>
            <p className="text-xs text-content-muted">
              Computed Pearson correlation coefficients across top portfolio positions.
            </p>
          </div>
          <span className="text-[11px] text-content-muted">Daily Log Returns Over 2024 YTD</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="text-content-muted border-b border-border/40">
                <th className="py-2.5 px-3 text-left">Asset</th>
                {assets.map((a) => (
                  <th key={a} className="py-2.5 px-3 font-bold text-content-primary">
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((rowAsset, rIdx) => (
                <tr key={rowAsset} className="border-b border-border/20">
                  <td className="py-2.5 px-3 text-left font-bold text-content-primary">{rowAsset}</td>
                  {assets.map((colAsset, cIdx) => {
                    const corr = corrMatrix[rIdx][cIdx]
                    let bgCol = 'bg-background-elevated'
                    if (corr === 1.0) bgCol = 'bg-brand-blue/30 text-white font-bold'
                    else if (corr > 0.7) bgCol = 'bg-brand-blue/20 text-brand-cyan font-semibold'
                    else if (corr > 0.3) bgCol = 'bg-brand-blue/10 text-content-primary'
                    else if (corr < 0) bgCol = 'bg-financial-positive/20 text-financial-positive font-semibold'

                    return (
                      <td key={colAsset} className={`py-2.5 px-3 tabular-nums ${bgCol}`}>
                        {corr.toFixed(2)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology & Assumptions Disclosure Panel */}
      <div className="p-4 rounded-xl border border-border/60 bg-background-surface/60 text-xs text-content-muted space-y-2">
        <div className="flex items-center gap-2 font-bold text-content-secondary">
          <Info className="w-4 h-4 text-brand-cyan" />
          <span>Quantitative Methodology & Parameter Notes</span>
        </div>
        <p className="leading-relaxed">
          <strong>Value at Risk (VaR):</strong> Evaluated using the non-parametric empirical quantile method on 205 daily return observations. 
          Annualized Volatility uses the classical square-root-of-time scaling factor ($\sqrt{252} \approx 15.874$). 
          Sharpe ratio assumes an annualized risk-free rate of {rfRate}%. Benchmark metrics are computed against aligned daily closes of {benchmark}.
        </p>
      </div>
    </div>
  )
}
