import React from 'react'
import { Calendar, Plus, Database } from 'lucide-react'
import { useApp, Timeframe } from '../../context/AppContext'

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL']

export const FilterBar: React.FC = () => {
  const { timeframe, setTimeframe, setIsAddAssetModalOpen, addNotification } = useApp()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      {/* Timeframe Selector Pills */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-background-surface border border-border shadow-sm">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeframe === tf
                ? 'bg-brand-blue text-white shadow-glow'
                : 'text-content-muted hover:text-content-primary hover:bg-background-hover/50'
            }`}
          >
            {tf}
          </button>
        ))}

        <button
          onClick={() => addNotification('Custom Date Range', 'Displaying full verified 2024 calendar window.', 'info')}
          className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-background-hover transition"
          title="Custom Date Range"
          aria-label="Select custom date range"
        >
          <Calendar className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Controls: Demo Data indicator & Add Asset Button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background-surface text-content-secondary text-xs font-semibold">
          <Database className="w-3.5 h-3.5 text-brand-cyan" />
          <span className="tracking-wider uppercase text-[10px]">Demo Data</span>
        </div>

        <button
          onClick={() => setIsAddAssetModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-blue hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-glow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Asset</span>
        </button>
      </div>
    </div>
  )
}
