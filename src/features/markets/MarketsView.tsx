import React, { useState } from 'react'
import { TrendingUp, Search, Star, Layers, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react'
import { CURATED_ASSETS } from '../../data/demo/assets'
import { useApp } from '../../context/AppContext'
import { MarketAsset } from '../../types/market'

export const MarketsView: React.FC = () => {
  const { watchlist, addToWatchlist, removeFromWatchlist, formatCurrency } = useApp()
  const [search, setSearch] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(CURATED_ASSETS[0])
  const [compareList, setCompareList] = useState<string[]>(['AAPL', 'MSFT', 'NVDA', 'SPY'])

  const filteredAssets = CURATED_ASSETS.filter(
    (a) =>
      a.symbol.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
  )

  const isWatched = watchlist.some((w) => w.symbol === selectedAsset.symbol)

  const toggleWatchlist = (asset: MarketAsset) => {
    if (watchlist.some((w) => w.symbol === asset.symbol)) {
      removeFromWatchlist(asset.symbol)
    } else {
      addToWatchlist({
        symbol: asset.symbol,
        name: asset.name,
        assetClass: asset.assetClass,
        targetBuyPrice: asset.price * 0.95,
        alertEnabled: true,
      })
    }
  }

  const toggleCompare = (sym: string) => {
    if (compareList.includes(sym)) {
      if (compareList.length > 1) {
        setCompareList(compareList.filter((s) => s !== sym))
      }
    } else {
      setCompareList([...compareList, sym])
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-background-surface shadow-panel">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-content-primary">Market Intelligence</h1>
          </div>
          <p className="mt-1 text-xs text-content-muted">
            Explore curated market benchmarks, asset metrics, valuations, and multi-asset performance comparisons.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-content-muted" />
          <input
            type="text"
            placeholder="Search universe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background-elevated border border-border text-xs text-content-primary focus:outline-none focus:border-brand-cyan"
          />
        </div>
      </div>

      {/* Selected Asset Spotlight & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Asset Detailed Quote Card */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-border/80 bg-background-surface shadow-panel space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-content-primary">{selectedAsset.symbol}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-background-elevated text-content-secondary border border-border">
                  {selectedAsset.assetClass}
                </span>
              </div>
              <div className="text-xs text-content-muted mt-0.5">{selectedAsset.name}</div>
            </div>

            <button
              onClick={() => toggleWatchlist(selectedAsset)}
              className={`p-2 rounded-lg border transition ${
                isWatched
                  ? 'border-financial-warning bg-financial-warning/20 text-financial-warning'
                  : 'border-border bg-background-elevated text-content-muted hover:text-content-primary'
              }`}
              title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className="w-4 h-4" />
            </button>
          </div>

          {/* Big Price Display */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-content-primary tabular-nums">
              ${selectedAsset.price.toFixed(2)}
            </span>
            <div
              className={`flex items-center gap-1 text-sm font-bold tabular-nums ${
                selectedAsset.dayChangePercent >= 0
                  ? 'text-financial-positive'
                  : 'text-financial-negative'
              }`}
            >
              {selectedAsset.dayChangePercent >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>
                {selectedAsset.dayChangePercent >= 0 ? '+' : ''}
                {selectedAsset.dayChangeDollar.toFixed(2)} ({selectedAsset.dayChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs">
            <div>
              <span className="text-content-muted">Market Cap</span>
              <div className="font-semibold text-content-primary tabular-nums mt-0.5">
                {selectedAsset.marketCap || 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-content-muted">Volume (24h)</span>
              <div className="font-semibold text-content-primary tabular-nums mt-0.5">
                {selectedAsset.volume || 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-content-muted">P/E Ratio (TTM)</span>
              <div className="font-semibold text-content-primary tabular-nums mt-0.5">
                {selectedAsset.peRatio || 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-content-muted">52-Week Range</span>
              <div className="font-semibold text-content-primary tabular-nums mt-0.5">
                ${selectedAsset.low52Week || 0} - ${selectedAsset.high52Week || 0}
              </div>
            </div>
          </div>

          {/* 5-day price chart preview */}
          <div className="pt-2 border-t border-border/40">
            <div className="text-[11px] font-semibold text-content-muted mb-2">
              Recent Price Trajectory (5 Days)
            </div>
            <div className="h-20 w-full flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                <polyline
                  points={selectedAsset.sparkline
                    .map((val, idx) => {
                      const min = Math.min(...selectedAsset.sparkline)
                      const max = Math.max(...selectedAsset.sparkline)
                      const range = max - min || 1
                      const x = (idx / (selectedAsset.sparkline.length - 1)) * 100
                      const y = 28 - ((val - min) / range) * 24
                      return `${x},${y}`
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Asset Performance Comparison Tool */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-border/80 bg-background-surface shadow-panel flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-blue" />
                <h3 className="text-sm font-bold text-content-primary">
                  Multi-Asset Comparative Performance
                </h3>
              </div>
              <span className="text-[11px] text-content-muted">Normalized to 100.0 Baseline</span>
            </div>

            {/* Comparison Badges */}
            <div className="flex flex-wrap gap-2 my-3">
              {CURATED_ASSETS.map((a) => {
                const active = compareList.includes(a.symbol)
                return (
                  <button
                    key={a.symbol}
                    onClick={() => toggleCompare(a.symbol)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      active
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'bg-background-elevated text-content-muted hover:text-content-primary border border-border'
                    }`}
                  >
                    {a.symbol}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Comparative SVG Line Chart */}
          <div className="relative h-[220px] w-full mt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Gridlines */}
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#142538" strokeWidth="1" strokeDasharray="3,3" />
              ))}

              {/* Asset comparison lines */}
              {compareList.map((sym, sIdx) => {
                const colors = ['#22D3EE', '#168BFF', '#00D6A0', '#FFB547', '#9A7BFF']
                const col = colors[sIdx % colors.length]
                const asset = CURATED_ASSETS.find((a) => a.symbol === sym)
                const spark = asset ? asset.sparkline : [100, 102, 104, 103, 107]
                const min = Math.min(...spark)
                const max = Math.max(...spark)
                const range = max - min || 1

                const pts = spark
                  .map((val, idx) => {
                    const x = (idx / (spark.length - 1)) * 500
                    const y = 170 - ((val - min) / range) * 140
                    return `${x},${y}`
                  })
                  .join(' ')

                return (
                  <g key={sym}>
                    <polyline
                      points={pts}
                      fill="none"
                      stroke={col}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-3 border-t border-border/40 text-xs font-semibold">
            {compareList.map((sym, sIdx) => {
              const colors = ['#22D3EE', '#168BFF', '#00D6A0', '#FFB547', '#9A7BFF']
              const col = colors[sIdx % colors.length]
              return (
                <div key={sym} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col }} />
                  <span className="text-content-secondary">{sym}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Full Market Assets Table */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel space-y-4">
        <h3 className="text-sm font-bold text-content-primary">Curated Asset Universe</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-content-muted border-b border-border/40">
                <th className="py-2.5 font-medium">Asset</th>
                <th className="py-2.5 font-medium">Class / Sector</th>
                <th className="py-2.5 font-medium text-right">Price</th>
                <th className="py-2.5 font-medium text-right">Day Change</th>
                <th className="py-2.5 font-medium text-right">Market Cap</th>
                <th className="py-2.5 font-medium text-right">P/E Ratio</th>
                <th className="py-2.5 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset.symbol === asset.symbol
                return (
                  <tr
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={`cursor-pointer transition ${
                      isSelected ? 'bg-brand-blue/15' : 'hover:bg-background-hover/40'
                    }`}
                  >
                    <td className="py-2.5 font-bold text-content-primary">
                      {asset.symbol}
                      <span className="block text-[10px] text-content-muted font-normal">{asset.name}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-background-elevated text-content-secondary border border-border">
                        {asset.assetClass}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-content-primary tabular-nums">
                      ${asset.price.toFixed(2)}
                    </td>
                    <td
                      className={`py-2.5 text-right font-semibold tabular-nums ${
                        asset.dayChangePercent >= 0 ? 'text-financial-positive' : 'text-financial-negative'
                      }`}
                    >
                      {asset.dayChangePercent >= 0 ? '+' : ''}
                      {asset.dayChangePercent.toFixed(2)}%
                    </td>
                    <td className="py-2.5 text-right text-content-secondary tabular-nums">
                      {asset.marketCap || '—'}
                    </td>
                    <td className="py-2.5 text-right text-content-secondary tabular-nums">
                      {asset.peRatio ? asset.peRatio.toFixed(1) : '—'}
                    </td>
                    <td className="py-2.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWatchlist(asset)
                        }}
                        className="p-1 rounded text-content-muted hover:text-financial-warning"
                        title="Toggle Watchlist"
                      >
                        <Star className="w-3.5 h-3.5" />
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
