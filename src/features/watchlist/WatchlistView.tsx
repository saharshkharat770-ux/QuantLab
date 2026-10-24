import React, { useState } from 'react'
import { Star, Plus, Trash2, Bell, BellOff, TrendingUp, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CURATED_ASSETS } from '../../data/demo/assets'

export const WatchlistView: React.FC = () => {
  const { watchlist, removeFromWatchlist, addToWatchlist, setCurrentView, addNotification } = useApp()
  const [selectedSym, setSelectedSym] = useState('TSLA')
  const [targetPrice, setTargetPrice] = useState('215.00')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const asset = CURATED_ASSETS.find((a) => a.symbol === selectedSym)
    if (!asset) return

    addToWatchlist({
      symbol: asset.symbol,
      name: asset.name,
      assetClass: asset.assetClass,
      targetBuyPrice: parseFloat(targetPrice) || asset.price * 0.95,
      alertEnabled: true,
    })
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-background-surface shadow-panel">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-financial-warning/20 border border-financial-warning/40 flex items-center justify-center text-financial-warning">
              <Star className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-content-primary">Asset Watchlist</h1>
          </div>
          <p className="mt-1 text-xs text-content-muted">
            Track asset price targets, monitor breakout levels, and set simulated price proximity alerts.
          </p>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedSym}
            onChange={(e) => setSelectedSym(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold"
          >
            {CURATED_ASSETS.map((a) => (
              <option key={a.symbol} value={a.symbol}>
                {a.symbol} - {a.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            step="0.5"
            placeholder="Target Price"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-28 px-3 py-1.5 rounded-lg bg-background-elevated border border-border text-content-primary text-right font-semibold"
          />

          <button
            type="submit"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-blue hover:brightness-110 active:scale-95 text-white font-bold shadow-glow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track</span>
          </button>
        </form>
      </div>

      {/* Watchlist Table */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel space-y-4">
        <h3 className="text-sm font-bold text-content-primary">Currently Monitored Assets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-content-muted border-b border-border/40">
                <th className="py-2.5 font-medium">Asset</th>
                <th className="py-2.5 font-medium">Asset Class</th>
                <th className="py-2.5 font-medium text-right">Current Market Price</th>
                <th className="py-2.5 font-medium text-right">Target Buy Price</th>
                <th className="py-2.5 font-medium text-right">Proximity to Target</th>
                <th className="py-2.5 font-medium text-center">Alert Status</th>
                <th className="py-2.5 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {watchlist.map((item) => {
                const asset = CURATED_ASSETS.find((a) => a.symbol === item.symbol)
                const currentPrice = asset ? asset.price : 200
                const target = item.targetBuyPrice || currentPrice * 0.95
                const diffPct = ((currentPrice - target) / currentPrice) * 100

                return (
                  <tr key={item.symbol} className="hover:bg-background-hover/40 transition">
                    <td className="py-3">
                      <div className="font-bold text-content-primary">{item.symbol}</div>
                      <div className="text-[10px] text-content-muted">{item.name}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-background-elevated text-content-secondary border border-border">
                        {item.assetClass}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-content-primary tabular-nums">
                      ${currentPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-semibold text-brand-cyan tabular-nums">
                      ${target.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-semibold tabular-nums">
                      <span
                        className={
                          Math.abs(diffPct) < 3
                            ? 'text-financial-positive font-bold'
                            : 'text-content-secondary'
                        }
                      >
                        {diffPct > 0 ? `+${diffPct.toFixed(1)}% above` : `${diffPct.toFixed(1)}% below`}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() =>
                          addNotification('Alert Status Toggled', `Notification alert updated for ${item.symbol}.`, 'info')
                        }
                        className="p-1 rounded text-brand-cyan hover:bg-brand-cyan/20 transition"
                        title="Alert Enabled"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => removeFromWatchlist(item.symbol)}
                        className="p-1 rounded text-content-muted hover:text-financial-negative transition"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
