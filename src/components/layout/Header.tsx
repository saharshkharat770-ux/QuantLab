import React from 'react'
import { Search, Bell } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const Header: React.FC = () => {
  const { marketIndices, setIsCommandPaletteOpen, notifications, addNotification } = useApp()

  return (
    <header className="h-16 border-b border-border bg-background-sidebar/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Global Search Input with Ctrl+K */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-background-surface border border-border hover:border-border-secondary text-content-muted text-xs transition group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-content-muted group-hover:text-brand-cyan transition-colors" />
            <span className="truncate">Search assets, indices, or analyze anything...</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] bg-background-elevated px-1.5 py-0.5 rounded border border-border/80 text-content-secondary">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right: Market Status, Indices, Notifications & User Avatar */}
      <div className="flex items-center gap-6">
        {/* Markets Open Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-financial-positive/10 border border-financial-positive/30 text-financial-positive text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-financial-positive animate-pulse" />
          <span>Markets Open</span>
        </div>

        {/* Market Index Summaries */}
        <div className="hidden xl:flex items-center gap-5 border-l border-r border-border/60 px-5">
          {marketIndices.map((idx) => (
            <div key={idx.symbol} className="text-xs">
              <span className="text-content-muted font-medium mr-2">{idx.symbol}</span>
              <span className="font-semibold text-content-primary tabular-nums">
                {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="ml-1.5 text-financial-positive font-semibold tabular-nums">
                +{idx.changePercent}%
              </span>
            </div>
          ))}
        </div>

        {/* Notifications & Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              addNotification(
                'Market Intelligence Alert',
                'Tech earnings week starting. Portfolio beta adjusted to 0.92.',
                'info'
              )
            }
            className="relative p-2 rounded-lg text-content-muted hover:text-content-primary hover:bg-background-hover transition"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-financial-negative text-white text-[10px] font-bold flex items-center justify-center">
              {notifications.length > 0 ? notifications.length : 3}
            </span>
          </button>

          {/* User Profile Avatar (Saharsh 'SK') */}
          <div className="flex items-center gap-2.5 pl-2">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#8a5035] to-[#c78864] border border-border flex items-center justify-center text-xs font-bold text-white shadow-sm cursor-pointer">
              <span>SK</span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-financial-positive border-2 border-background-sidebar" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
