import React, { useState } from 'react'
import { DollarSign, TrendingUp, ShieldCheck, BarChart2, Eye, EyeOff, MoreVertical } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const KpiCards: React.FC = () => {
  const { summary, formatCurrency } = useApp()
  const [showValue, setShowValue] = useState(true)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Portfolio Value Card */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel flex flex-col justify-between relative group hover:border-border-secondary transition">
        <div>
          <div className="flex items-center justify-between text-content-muted">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-financial-positive/15 text-financial-positive flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-content-secondary">Portfolio Value</span>
              <button
                onClick={() => setShowValue(!showValue)}
                className="text-content-muted hover:text-content-primary transition ml-0.5"
                title={showValue ? 'Hide balance' : 'Show balance'}
                aria-label="Toggle portfolio visibility"
              >
                {showValue ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button className="text-content-muted hover:text-content-primary p-1 rounded" aria-label="More options">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-content-primary tabular-nums tracking-tight">
              {showValue ? formatCurrency(summary.totalValue) : '••••••••'}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-financial-positive">
              <span>
                +{formatCurrency(summary.dailyPnL)} (+{summary.dailyPnLPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Mini Green Sparkline */}
        <div className="mt-3 h-7 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none">
            <path
              d="M0,20 Q15,18 25,12 T50,14 T75,8 T100,2"
              fill="none"
              stroke="#00D6A0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 2. Daily P&L Card */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel flex flex-col justify-between relative group hover:border-border-secondary transition">
        <div>
          <div className="flex items-center justify-between text-content-muted">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-cyan/15 text-brand-cyan flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-content-secondary">Daily P&L</span>
            </div>
            <button className="text-content-muted hover:text-content-primary p-1 rounded" aria-label="More options">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-financial-positive tabular-nums tracking-tight">
              +{formatCurrency(summary.dailyPnL)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-financial-positive">
              <span>+{summary.dailyPnLPercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Mini Green Bar Chart Graphic */}
        <div className="mt-3 h-7 w-full flex items-end gap-1.5 justify-end">
          <span className="w-1.5 h-3 bg-financial-positive/40 rounded-t" />
          <span className="w-1.5 h-4 bg-financial-positive/60 rounded-t" />
          <span className="w-1.5 h-3.5 bg-financial-positive/50 rounded-t" />
          <span className="w-1.5 h-5 bg-financial-positive/80 rounded-t" />
          <span className="w-1.5 h-6 bg-financial-positive rounded-t shadow-glow-teal" />
        </div>
      </div>

      {/* 3. Annualized Volatility Card */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel flex flex-col justify-between relative group hover:border-border-secondary transition">
        <div>
          <div className="flex items-center justify-between text-content-muted">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-blue/15 text-brand-blue flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-content-secondary">Annualized Volatility</span>
            </div>
            <button className="text-content-muted hover:text-content-primary p-1 rounded" aria-label="More options">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-content-primary tabular-nums tracking-tight">
              {summary.annualizedVolatility.toFixed(2)}%
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-content-muted">
              <span>252-day historical standard deviation</span>
            </div>
          </div>
        </div>

        {/* Mini Blue Sparkline */}
        <div className="mt-3 h-7 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none">
            <path
              d="M0,14 Q20,6 40,16 T70,10 T100,12"
              fill="none"
              stroke="#168BFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 4. Sharpe Ratio Card */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel flex flex-col justify-between relative group hover:border-border-secondary transition">
        <div>
          <div className="flex items-center justify-between text-content-muted">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-teal/15 text-brand-teal flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-content-secondary">Sharpe Ratio</span>
            </div>
            <button className="text-content-muted hover:text-content-primary p-1 rounded" aria-label="More options">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-extrabold text-content-primary tabular-nums tracking-tight">
              {summary.sharpeRatio.toFixed(2)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-content-muted">
              <span>Risk-free rate: 4.5% (US 3M T-Bill)</span>
            </div>
          </div>
        </div>

        {/* Mini Teal Sparkline */}
        <div className="mt-3 h-7 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none">
            <path
              d="M0,18 Q30,10 50,15 T80,6 T100,4"
              fill="none"
              stroke="#00D6A0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
