import React, { useState, useMemo } from 'react'
import {
  Sliders,
  Zap,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  Play,
  RotateCcw,
  Percent,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  STRESS_PRESETS,
  applyStressScenario,
  runMonteCarloSimulation,
} from '../../engine/scenario/engine'

export const ScenarioView: React.FC = () => {
  const { holdings, cashBalance, summary, formatCurrency, addNotification } = useApp()

  // Scenario shock sliders
  const [marketShock, setMarketShock] = useState<number>(-15)
  const [techShock, setTechShock] = useState<number>(-20)
  const [activePreset, setActivePreset] = useState<string | null>(null)

  // Monte Carlo parameters
  const [mcHorizonDays, setMcHorizonDays] = useState<number>(252)
  const [mcPaths, setMcPaths] = useState<number>(500)
  const [mcSeed, setMcSeed] = useState<number>(42)

  // Apply stress scenario
  const scenarioResult = useMemo(() => {
    return applyStressScenario(holdings, cashBalance, marketShock, {
      Technology: techShock,
    })
  }, [holdings, cashBalance, marketShock, techShock])

  // Run Monte Carlo
  const mcResult = useMemo(() => {
    return runMonteCarloSimulation(
      summary.totalValue,
      8.5,
      summary.annualizedVolatility,
      mcHorizonDays,
      mcPaths,
      mcSeed
    )
  }, [summary.totalValue, summary.annualizedVolatility, mcHorizonDays, mcPaths, mcSeed])

  const selectPreset = (presetId: string) => {
    const p = STRESS_PRESETS.find((x) => x.id === presetId)
    if (!p) return
    setActivePreset(presetId)
    setMarketShock(p.marketShockPercent)
    setTechShock(p.sectorShocks['Technology'] ?? p.marketShockPercent)
    addNotification('Stress Preset Applied', `Loaded assumptions for ${p.name}.`, 'info')
  }

  const resetShocks = () => {
    setActivePreset(null)
    setMarketShock(0)
    setTechShock(0)
    addNotification('Shocks Reset', 'Restored 0% baseline assumptions.', 'info')
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-background-surface shadow-panel">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-violet">
              <Sliders className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-content-primary">Scenario Studio & Stress Lab</h1>
          </div>
          <p className="mt-1 text-xs text-content-muted">
            Hypothetical macro stress testing, sector shock modeling, and multi-path Monte Carlo asset projection.
          </p>
        </div>

        <button
          onClick={resetShocks}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-background-elevated hover:border-brand-cyan text-content-secondary hover:text-content-primary text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Shocks</span>
        </button>
      </div>

      {/* Preset Macro Stress Scenarios */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-content-secondary uppercase tracking-wider">
          <Zap className="w-4 h-4 text-financial-warning" />
          <span>Historical & Theoretical Stress Presets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STRESS_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id
            return (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition ${
                  isSelected
                    ? 'border-brand-cyan bg-brand-blue/15 shadow-glow-cyan'
                    : 'border-border bg-background-elevated hover:border-border-secondary'
                }`}
              >
                <div className="font-bold text-xs text-content-primary">{preset.name}</div>
                <div className="text-[10px] text-content-muted mt-1 leading-relaxed">
                  {preset.description}
                </div>
                <div className="mt-2 text-[11px] font-bold text-financial-negative">
                  Broad Market: {preset.marketShockPercent}%
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Interactive Sliders & Projected Impact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Column (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-border/80 bg-background-surface shadow-panel space-y-5">
          <h3 className="text-sm font-bold text-content-primary">Custom Shock Parameters</h3>

          {/* Broad Market Shock */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-content-secondary font-medium">Broad Market Equities Shock</span>
              <span className={`font-bold tabular-nums ${marketShock >= 0 ? 'text-financial-positive' : 'text-financial-negative'}`}>
                {marketShock >= 0 ? '+' : ''}{marketShock}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={marketShock}
              onChange={(e) => {
                setActivePreset(null)
                setMarketShock(parseInt(e.target.value))
              }}
              className="w-full accent-brand-cyan cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-content-muted">
              <span>-50% (Crash)</span>
              <span>0% (Neutral)</span>
              <span>+50% (Rally)</span>
            </div>
          </div>

          {/* Technology Sector Shock */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-content-secondary font-medium">Tech & Growth Sector Shock</span>
              <span className={`font-bold tabular-nums ${techShock >= 0 ? 'text-financial-positive' : 'text-financial-negative'}`}>
                {techShock >= 0 ? '+' : ''}{techShock}%
              </span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="1"
              value={techShock}
              onChange={(e) => {
                setActivePreset(null)
                setTechShock(parseInt(e.target.value))
              }}
              className="w-full accent-brand-blue cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-content-muted">
              <span>-60% (Deflation)</span>
              <span>0%</span>
              <span>+60% (Tech Boom)</span>
            </div>
          </div>

          {/* Modeled Result Card */}
          <div className="p-4 rounded-xl border border-border bg-background-elevated space-y-2">
            <div className="text-xs text-content-muted">Simulated Portfolio Outcome</div>
            <div className="text-2xl font-black text-content-primary tabular-nums">
              {formatCurrency(scenarioResult.stressedValue)}
            </div>
            <div className={`text-xs font-bold tabular-nums ${scenarioResult.projectedPnL >= 0 ? 'text-financial-positive' : 'text-financial-negative'}`}>
              {scenarioResult.projectedPnL >= 0 ? '+' : ''}
              {formatCurrency(scenarioResult.projectedPnL)} ({scenarioResult.projectedPnLPercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Asset-by-Asset Impact Breakdown Table (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-border/80 bg-background-surface shadow-panel space-y-3">
          <h3 className="text-sm font-bold text-content-primary">Holding Impact Decomposition</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-content-muted border-b border-border/40">
                  <th className="py-2.5 font-medium">Asset</th>
                  <th className="py-2.5 font-medium text-right">Pre-Shock</th>
                  <th className="py-2.5 font-medium text-right">Stress Shock</th>
                  <th className="py-2.5 font-medium text-right">Modeled Value</th>
                  <th className="py-2.5 font-medium text-right">Dollar Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {scenarioResult.assetImpacts.map((item) => (
                  <tr key={item.symbol} className="hover:bg-background-hover/40 transition">
                    <td className="py-2 font-bold text-content-primary">
                      {item.symbol}
                      <span className="block text-[10px] text-content-muted font-normal">{item.assetClass}</span>
                    </td>
                    <td className="py-2 text-right text-content-secondary tabular-nums">
                      {formatCurrency(item.currentValue)}
                    </td>
                    <td className={`py-2 text-right font-bold tabular-nums ${item.percentImpact >= 0 ? 'text-financial-positive' : 'text-financial-negative'}`}>
                      {item.percentImpact >= 0 ? '+' : ''}{item.percentImpact}%
                    </td>
                    <td className="py-2 text-right font-bold text-content-primary tabular-nums">
                      {formatCurrency(item.stressedValue)}
                    </td>
                    <td className={`py-2 text-right font-semibold tabular-nums ${item.dollarImpact >= 0 ? 'text-financial-positive' : 'text-financial-negative'}`}>
                      {item.dollarImpact >= 0 ? '+' : ''}{formatCurrency(item.dollarImpact)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Monte Carlo Geometric Brownian Motion Engine */}
      <div className="p-5 rounded-xl border border-border/80 bg-background-surface shadow-panel space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
          <div>
            <h3 className="text-sm font-bold text-content-primary">
              Monte Carlo Wealth Projection ({mcPaths.toLocaleString()} Deterministic Paths)
            </h3>
            <p className="text-xs text-content-muted">
              Geometric Brownian Motion with drift $\mu = 8.5\%$ and $\sigma = {summary.annualizedVolatility.toFixed(2)}\%$.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={mcHorizonDays}
              onChange={(e) => setMcHorizonDays(parseInt(e.target.value))}
              className="text-xs font-semibold bg-background-elevated border border-border text-content-secondary px-3 py-1.5 rounded-lg"
            >
              <option value={63}>Horizon: 3 Months</option>
              <option value={126}>Horizon: 6 Months</option>
              <option value={252}>Horizon: 1 Year (252 Days)</option>
              <option value={504}>Horizon: 2 Years (504 Days)</option>
            </select>

            <button
              onClick={() => setMcSeed((prev) => prev + 1)}
              className="p-1.5 rounded-lg border border-border bg-background-elevated text-content-muted hover:text-brand-cyan transition"
              title="Reseed Simulation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Monte Carlo Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-border bg-background-elevated">
            <span className="text-content-muted">Median Outcome (50th)</span>
            <div className="text-lg font-bold text-brand-cyan tabular-nums mt-0.5">
              {formatCurrency(mcResult.medianTerminalValue)}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-background-elevated">
            <span className="text-content-muted">Bearish Outcome (5th)</span>
            <div className="text-lg font-bold text-financial-negative tabular-nums mt-0.5">
              {formatCurrency(mcResult.percentile5)}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-background-elevated">
            <span className="text-content-muted">Bullish Outcome (95th)</span>
            <div className="text-lg font-bold text-financial-positive tabular-nums mt-0.5">
              {formatCurrency(mcResult.percentile95)}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-background-elevated">
            <span className="text-content-muted">Probability of Loss</span>
            <div className="text-lg font-bold text-financial-warning tabular-nums mt-0.5">
              {mcResult.probabilityOfLossPercent}%
            </div>
          </div>
        </div>

        {/* Monte Carlo Fan Chart SVG */}
        <div className="h-[220px] w-full relative mt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mcFanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#168BFF" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Baseline Initial Wealth Line */}
            <line x1="0" y1="120" x2="600" y2="120" stroke="#243D57" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* 5th to 95th Percentile Fan Area */}
            <polygon
              points={`${mcResult.representativePaths
                .map((pt, idx) => {
                  const x = (idx / (mcResult.representativePaths.length - 1)) * 600
                  const y = 120 - ((pt.p95 - summary.totalValue) / summary.totalValue) * 100
                  return `${x},${y}`
                })
                .join(' ')} ${[...mcResult.representativePaths]
                .reverse()
                .map((pt, idx) => {
                  const x = ((mcResult.representativePaths.length - 1 - idx) / (mcResult.representativePaths.length - 1)) * 600
                  const y = 120 - ((pt.p5 - summary.totalValue) / summary.totalValue) * 100
                  return `${x},${y}`
                })
                .join(' ')}`}
              fill="url(#mcFanGrad)"
            />

            {/* Median 50th line */}
            <polyline
              points={mcResult.representativePaths
                .map((pt, idx) => {
                  const x = (idx / (mcResult.representativePaths.length - 1)) * 600
                  const y = 120 - ((pt.p50 - summary.totalValue) / summary.totalValue) * 100
                  return `${x},${y}`
                })
                .join(' ')}
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        <div className="flex justify-between text-[10px] text-content-muted pt-2 border-t border-border/40">
          <span>Day 0 (Initial: {formatCurrency(summary.totalValue)})</span>
          <span>Day {Math.floor(mcHorizonDays / 2)}</span>
          <span>Day {mcHorizonDays} (Horizon End)</span>
        </div>
      </div>
    </div>
  )
}
