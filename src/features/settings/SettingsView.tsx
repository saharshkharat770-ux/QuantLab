import React from 'react'
import { Settings, RefreshCw, DollarSign, Database, Shield, Moon, Eye } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const SettingsView: React.FC = () => {
  const {
    currency,
    setCurrency,
    benchmark,
    setBenchmark,
    resetDemoData,
    summary,
    formatCurrency,
  } = useApp()

  return (
    <div className="space-y-6 pb-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-background-surface shadow-panel">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-content-muted/20 border border-content-muted/40 flex items-center justify-center text-content-primary">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-content-primary">Platform Settings</h1>
          </div>
          <p className="mt-1 text-xs text-content-muted">
            Configure currency presentation, default benchmarks, analytical risk parameters, and demo state.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-financial-warning/50 bg-financial-warning/10 hover:bg-financial-warning/20 text-financial-warning text-xs font-bold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Preferences Grid */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-6 shadow-panel space-y-6 text-xs">
        {/* Currency Presentation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
          <div>
            <div className="font-bold text-content-primary">Base Currency Unit</div>
            <div className="text-content-muted mt-0.5">
              Select standard currency symbol for valuation figures across all panels.
            </div>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold focus:outline-none focus:border-brand-cyan"
          >
            <option value="USD">USD ($) - United States Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="INR">INR (₹) - Indian Rupee</option>
          </select>
        </div>

        {/* Default Benchmark */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
          <div>
            <div className="font-bold text-content-primary">Primary Benchmark Index</div>
            <div className="text-content-muted mt-0.5">
              Baseline used for comparative returns, beta, correlation, and alpha calculations.
            </div>
          </div>
          <select
            value={benchmark}
            onChange={(e) => setBenchmark(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold focus:outline-none focus:border-brand-cyan"
          >
            <option value="S&P 500">S&P 500 (US Broad Market)</option>
            <option value="NASDAQ">NASDAQ Composite (Tech-Heavy)</option>
            <option value="NIFTY 50">NSE Nifty 50 (India Benchmark)</option>
          </select>
        </div>

        {/* Dark Terminal Aesthetic */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
          <div>
            <div className="font-bold text-content-primary">Visual Identity Theme</div>
            <div className="text-content-muted mt-0.5">
              Institutional Dark Finance Command Center (locked as primary design specification).
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-background-elevated border border-border text-brand-cyan font-bold">
            Dark Institutional
          </span>
        </div>

        {/* Data Provenance & Open Science Note */}
        <div className="p-4 rounded-xl border border-border/60 bg-background-elevated space-y-2">
          <div className="flex items-center gap-2 font-bold text-content-secondary">
            <Database className="w-4 h-4 text-brand-cyan" />
            <span>Data Provenance & Demonstration Architecture</span>
          </div>
          <p className="leading-relaxed text-content-muted text-[11px]">
            QUANTLAB runs in client-side static mode on GitHub Pages with zero required API keys. 
            All mathematical calculations (Sharpe ratio, historical VaR, expected shortfall, rolling volatility, Monte Carlo fan charts, and SMA crossover backtesting) are executed in pure TypeScript within the browser.
          </p>
        </div>
      </div>
    </div>
  )
}
