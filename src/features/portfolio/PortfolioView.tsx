import React, { useState } from 'react'
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Sliders,
  Download,
  Search,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Percent,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateHoldingMetrics } from '../../engine/portfolio/calculations'
import { Holding, AssetClass } from '../../types/portfolio'

export const PortfolioView: React.FC = () => {
  const {
    holdings,
    cashBalance,
    summary,
    removeHolding,
    updateHolding,
    setIsAddAssetModalOpen,
    rebalanceHoldings,
    formatCurrency,
    addNotification,
  } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('ALL')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQty, setEditQty] = useState<number>(0)
  const [editPrice, setEditPrice] = useState<number>(0)

  // Rebalancing sliders state
  const [isRebalanceOpen, setIsRebalanceOpen] = useState(false)
  const [targetWeights, setTargetWeights] = useState<Record<string, number>>(() => {
    const weights: Record<string, number> = {}
    const totalVal = summary.totalValue || 1
    holdings.forEach((h) => {
      weights[h.symbol] = Number(((h.quantity * h.currentPrice / totalVal) * 100).toFixed(1))
    })
    return weights
  })

  // Filtered holdings
  const filteredHoldings = holdings.filter((h) => {
    const matchesSearch =
      h.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = selectedClass === 'ALL' || h.assetClass === selectedClass
    return matchesSearch && matchesClass
  })

  // Export CSV
  const exportHoldingsCSV = () => {
    const headers = ['Symbol,Name,Asset Class,Sector,Quantity,Buy Price,Current Price,Market Value,Unrealized PnL,Weight%']
    const rows = holdings.map((h) => {
      const metrics = calculateHoldingMetrics(h)
      const weight = ((metrics.marketValue / summary.totalValue) * 100).toFixed(2)
      return `"${h.symbol}","${h.name}","${h.assetClass}","${h.sector || ''}",${h.quantity},${h.buyPrice},${h.currentPrice},${metrics.marketValue.toFixed(2)},${metrics.unrealizedPnL.toFixed(2)},${weight}%`
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `quantlab_holdings_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addNotification('CSV Exported', 'Holdings data downloaded successfully.', 'success')
  }

  const startEdit = (h: Holding) => {
    setEditingId(h.id)
    setEditQty(h.quantity)
    setEditPrice(h.buyPrice)
  }

  const saveEdit = (id: string) => {
    if (editQty <= 0) {
      addNotification('Invalid Quantity', 'Holding quantity must be greater than zero.', 'error')
      return
    }
    updateHolding(id, { quantity: editQty, buyPrice: editPrice })
    setEditingId(null)
  }

  // Handle rebalance submission
  const handleApplyRebalance = () => {
    const totalWeight = Object.values(targetWeights).reduce((s, w) => s + w, 0)
    if (Math.abs(totalWeight - 100) > 1.5) {
      addNotification('Target Weight Mismatch', `Target weights sum to ${totalWeight.toFixed(1)}%. They must total ~100%.`, 'warning')
      return
    }
    rebalanceHoldings(targetWeights)
    setIsRebalanceOpen(false)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-background-surface shadow-panel">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <Briefcase className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-content-primary">Portfolio Workspace</h1>
          </div>
          <p className="mt-1 text-xs text-content-muted">
            Manage position quantities, cost basis, target weights, and asset class distributions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRebalanceOpen(!isRebalanceOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-background-elevated hover:border-brand-cyan text-content-secondary hover:text-content-primary text-xs font-semibold transition"
          >
            <Sliders className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Rebalance Editor</span>
          </button>

          <button
            onClick={exportHoldingsCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-background-elevated hover:border-brand-cyan text-content-secondary hover:text-content-primary text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-brand-teal" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddAssetModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-blue hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-glow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Position</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-background-surface shadow-panel">
          <div className="text-xs text-content-muted font-medium">Total Market Value</div>
          <div className="text-xl font-bold text-content-primary mt-1 tabular-nums">
            {formatCurrency(summary.totalValue)}
          </div>
          <div className="text-[11px] text-content-secondary mt-0.5">
            Holdings + Cash ({formatCurrency(cashBalance)})
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background-surface shadow-panel">
          <div className="text-xs text-content-muted font-medium">Total Invested Cost Basis</div>
          <div className="text-xl font-bold text-content-primary mt-1 tabular-nums">
            {formatCurrency(summary.totalCostBasis)}
          </div>
          <div className="text-[11px] text-content-secondary mt-0.5">Weighted average acquisition</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background-surface shadow-panel">
          <div className="text-xs text-content-muted font-medium">Total Unrealized P&L</div>
          <div
            className={`text-xl font-bold mt-1 tabular-nums ${
              summary.unrealizedPnL >= 0 ? 'text-financial-positive' : 'text-financial-negative'
            }`}
          >
            {summary.unrealizedPnL >= 0 ? '+' : ''}
            {formatCurrency(summary.unrealizedPnL)} ({summary.unrealizedPnLPercent.toFixed(2)}%)
          </div>
          <div className="text-[11px] text-content-secondary mt-0.5">Cumulative paper gain/loss</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background-surface shadow-panel">
          <div className="text-xs text-content-muted font-medium">Liquid Cash Buffer</div>
          <div className="text-xl font-bold text-brand-violet mt-1 tabular-nums">
            {formatCurrency(cashBalance)}
          </div>
          <div className="text-[11px] text-content-secondary mt-0.5">
            {((cashBalance / summary.totalValue) * 100).toFixed(1)}% of total portfolio
          </div>
        </div>
      </div>

      {/* Rebalancing Tool Drawer */}
      {isRebalanceOpen && (
        <div className="p-5 rounded-2xl border border-brand-blue/50 bg-background-surface shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div>
              <h3 className="text-sm font-bold text-content-primary">Target Allocation Rebalancing</h3>
              <p className="text-xs text-content-muted">
                Adjust sliders to define target weights. The simulator calculates exact share adjustments.
              </p>
            </div>
            <div className="text-xs font-semibold text-brand-cyan">
              Total Target:{' '}
              {Object.values(targetWeights)
                .reduce((s, w) => s + (w || 0), 0)
                .toFixed(1)}
              %
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {holdings.map((h) => {
              const currentWeight = ((h.quantity * h.currentPrice) / summary.totalValue) * 100
              const target = targetWeights[h.symbol] ?? Number(currentWeight.toFixed(1))
              const delta = target - currentWeight

              return (
                <div key={h.id} className="p-3 rounded-lg border border-border bg-background-elevated space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-content-primary">{h.symbol}</span>
                    <span className="tabular-nums font-semibold text-brand-cyan">{target}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.5"
                    value={target}
                    onChange={(e) =>
                      setTargetWeights({ ...targetWeights, [h.symbol]: parseFloat(e.target.value) })
                    }
                    className="w-full accent-brand-cyan cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-content-muted">
                    <span>Cur: {currentWeight.toFixed(1)}%</span>
                    <span className={delta >= 0 ? 'text-financial-positive' : 'text-financial-negative'}>
                      {delta >= 0 ? '+' : ''}
                      {delta.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsRebalanceOpen(false)}
              className="px-4 py-2 rounded-lg border border-border text-content-secondary hover:text-content-primary text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyRebalance}
              className="px-5 py-2 rounded-lg bg-brand-blue hover:brightness-110 text-white text-xs font-bold shadow-glow"
            >
              Simulate & Apply Rebalance
            </button>
          </div>
        </div>
      )}

      {/* Holdings Filter & Table */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel space-y-4">
        {/* Search & Class Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-content-muted" />
            <input
              type="text"
              placeholder="Search by symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background-elevated border border-border text-xs text-content-primary focus:outline-none focus:border-brand-cyan"
            />
          </div>

          {/* Class Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {['ALL', 'Equities', 'Bonds', 'ETFs'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedClass === cls
                    ? 'bg-brand-blue/20 text-brand-cyan border border-brand-blue/40'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Holdings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-content-muted border-b border-border/40">
                <th className="py-3 font-medium">Asset</th>
                <th className="py-3 font-medium">Class / Sector</th>
                <th className="py-3 font-medium text-right">Quantity</th>
                <th className="py-3 font-medium text-right">Avg Buy Price</th>
                <th className="py-3 font-medium text-right">Current Price</th>
                <th className="py-3 font-medium text-right">Market Value</th>
                <th className="py-3 font-medium text-right">Weight</th>
                <th className="py-3 font-medium text-right">Day Change</th>
                <th className="py-3 font-medium text-right">Unrealized P&L</th>
                <th className="py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredHoldings.map((h) => {
                const metrics = calculateHoldingMetrics(h)
                const weight =
                  summary.totalValue > 0 ? (metrics.marketValue / summary.totalValue) * 100 : 0
                const isEditing = editingId === h.id

                return (
                  <tr key={h.id} className="hover:bg-background-hover/40 transition">
                    {/* Symbol & Name */}
                    <td className="py-3">
                      <div className="font-bold text-content-primary">{h.symbol}</div>
                      <div className="text-[11px] text-content-muted truncate max-w-[120px]">{h.name}</div>
                    </td>

                    {/* Class & Sector */}
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-background-elevated text-content-secondary border border-border">
                        {h.assetClass}
                      </span>
                      {h.sector && (
                        <div className="text-[10px] text-content-muted mt-0.5">{h.sector}</div>
                      )}
                    </td>

                    {/* Quantity */}
                    <td className="py-3 text-right font-medium text-content-primary tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editQty}
                          onChange={(e) => setEditQty(parseFloat(e.target.value) || 0)}
                          className="w-20 px-1 py-0.5 bg-background-elevated border border-brand-cyan rounded text-right text-xs"
                        />
                      ) : (
                        h.quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      )}
                    </td>

                    {/* Buy Price */}
                    <td className="py-3 text-right font-medium text-content-secondary tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editPrice}
                          onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                          className="w-20 px-1 py-0.5 bg-background-elevated border border-brand-cyan rounded text-right text-xs"
                        />
                      ) : (
                        `$${h.buyPrice.toFixed(2)}`
                      )}
                    </td>

                    {/* Current Price */}
                    <td className="py-3 text-right font-bold text-content-primary tabular-nums">
                      ${h.currentPrice.toFixed(2)}
                    </td>

                    {/* Market Value */}
                    <td className="py-3 text-right font-bold text-content-primary tabular-nums">
                      {formatCurrency(metrics.marketValue)}
                    </td>

                    {/* Weight */}
                    <td className="py-3 text-right font-medium text-content-secondary tabular-nums">
                      {weight.toFixed(1)}%
                    </td>

                    {/* Day Change */}
                    <td
                      className={`py-3 text-right font-semibold tabular-nums ${
                        h.dayChangePercent >= 0 ? 'text-financial-positive' : 'text-financial-negative'
                      }`}
                    >
                      {h.dayChangePercent >= 0 ? '+' : ''}
                      {h.dayChangePercent.toFixed(2)}%
                    </td>

                    {/* Unrealized P&L */}
                    <td
                      className={`py-3 text-right font-semibold tabular-nums ${
                        metrics.unrealizedPnL >= 0 ? 'text-financial-positive' : 'text-financial-negative'
                      }`}
                    >
                      {metrics.unrealizedPnL >= 0 ? '+' : ''}
                      {formatCurrency(metrics.unrealizedPnL)}
                      <div className="text-[10px] text-content-muted">
                        ({metrics.unrealizedPnLPercent.toFixed(1)}%)
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isEditing ? (
                          <button
                            onClick={() => saveEdit(h.id)}
                            className="p-1 rounded bg-financial-positive/20 text-financial-positive hover:bg-financial-positive/30"
                            title="Save changes"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(h)}
                            className="p-1 rounded text-content-muted hover:text-brand-cyan transition"
                            title="Edit shares or cost basis"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => removeHolding(h.id)}
                          className="p-1 rounded text-content-muted hover:text-financial-negative transition"
                          title="Liquidate holding"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
