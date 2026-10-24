import React from 'react'
import { ArrowRight, ShieldAlert, AlertTriangle, TrendingDown, Layers, Link2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const RiskSnapshot: React.FC = () => {
  const { setCurrentView, benchmark } = useApp()

  // Risk values matching reference screenshot
  const score = 62
  const maxScore = 100
  const var95 = -4280
  const es95 = -6720
  const maxDD = -8.4
  const beta = 0.92
  const correlation = 0.76

  // Semicircular arc parameters
  const radius = 64
  const strokeWidth = 10
  const cx = 95
  const cy = 80
  const circumference = Math.PI * radius // Half circle = ~201
  const strokeDashoffset = circumference - (score / maxScore) * circumference

  return (
    <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel flex flex-col justify-between">
      {/* Header with View Details -> link to Risk Lab */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h3 className="text-sm font-bold text-content-primary">Risk Snapshot</h3>
        <button
          onClick={() => setCurrentView('risk-lab')}
          className="text-xs font-semibold text-brand-blue hover:text-brand-cyan flex items-center gap-1 transition group"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Semicircular Gauge (Score 62 / 100 MEDIUM RISK) */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="relative w-[190px] h-[100px] flex items-end justify-center">
          <svg className="w-[190px] h-[100px] overflow-visible" viewBox="0 0 190 95">
            <defs>
              <linearGradient id="riskGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D6A0" />
                <stop offset="45%" stopColor="#FFB547" />
                <stop offset="100%" stopColor="#FF647C" />
              </linearGradient>
            </defs>

            {/* Background Arc Track */}
            <path
              d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
              fill="none"
              stroke="#132338"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Filled Progress Arc */}
            <path
              d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
              fill="none"
              stroke="url(#riskGaugeGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Text inside Semicircle */}
          <div className="absolute bottom-1 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold tracking-wider text-financial-warning uppercase">
              MEDIUM RISK
            </span>
            <div className="flex items-baseline gap-0.5 leading-none mt-1">
              <span className="text-3xl font-black text-content-primary tabular-nums tracking-tight">
                {score}
              </span>
              <span className="text-xs font-semibold text-content-muted">/100</span>
            </div>
          </div>
        </div>

        {/* Low and High labels */}
        <div className="w-[170px] flex items-center justify-between text-[10px] font-semibold text-content-muted mt-1 px-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Key Metric Rows Matching Reference Image */}
      <div className="space-y-2.5 pt-2 border-t border-border/40 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-content-muted">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Value at Risk (95%)</span>
          </div>
          <span className="font-semibold text-financial-negative tabular-nums">
            -${Math.abs(var95).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-content-muted">
            <AlertTriangle className="w-3.5 h-3.5 text-financial-warning" />
            <span>Expected Shortfall (95%)</span>
          </div>
          <span className="font-semibold text-financial-negative tabular-nums">
            -${Math.abs(es95).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-content-muted">
            <TrendingDown className="w-3.5 h-3.5 text-financial-negative" />
            <span>Max Drawdown</span>
          </div>
          <span className="font-semibold text-financial-negative tabular-nums">{maxDD}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-content-muted">
            <Layers className="w-3.5 h-3.5 text-brand-blue" />
            <span>Beta (vs {benchmark})</span>
          </div>
          <span className="font-semibold text-content-primary tabular-nums">{beta}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-content-muted">
            <Link2 className="w-3.5 h-3.5 text-brand-teal" />
            <span>Correlation (vs {benchmark})</span>
          </div>
          <span className="font-semibold text-content-primary tabular-nums">{correlation}</span>
        </div>
      </div>
    </div>
  )
}
