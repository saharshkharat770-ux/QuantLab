import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateHoldingMetrics } from '../../engine/portfolio/calculations'

export const TopHoldingsTable: React.FC = () => {
  const { holdings, summary, setCurrentView, formatCurrency } = useApp()

  // Sort by market value descending and pick top 5
  const topHoldings = [...holdings]
    .sort((a, b) => b.quantity * b.currentPrice - a.quantity * a.currentPrice)
    .slice(0, 5)

  // Color badges for symbols
  const symbolColors: Record<string, { bg: string; text: string }> = {
    AAPL: { bg: 'bg-[#a3aaae]/20', text: 'text-[#e5e5ea]' },
    MSFT: { bg: 'bg-[#00a4ef]/20', text: 'text-[#00a4ef]' },
    NVDA: { bg: 'bg-[#76b900]/20', text: 'text-[#76b900]' },
    SPY: { bg: 'bg-[#168BFF]/20', text: 'text-[#168BFF]' },
    BND: { bg: 'bg-[#22D3EE]/20', text: 'text-[#22D3EE]' },
    GOOGL: { bg: 'bg-[#ea4335]/20', text: 'text-[#ea4335]' },
    TLT: { bg: 'bg-[#9A7BFF]/20', text: 'text-[#9A7BFF]' },
  }

  return (
    <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel flex flex-col justify-between">
      {/* Header with View All -> link */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h3 className="text-sm font-bold text-content-primary">Top Holdings</h3>
        <button
          onClick={() => setCurrentView('portfolio')}
          className="text-xs font-semibold text-brand-blue hover:text-brand-cyan flex items-center gap-1 transition group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto my-1">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-content-muted border-b border-border/40">
              <th className="py-2.5 font-medium">Asset</th>
              <th className="py-2.5 font-medium text-right">Price</th>
              <th className="py-2.5 font-medium text-right">Weight</th>
              <th className="py-2.5 font-medium text-right">Day Change</th>
              <th className="py-2.5 font-medium text-right">P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {topHoldings.map((h) => {
              const metrics = calculateHoldingMetrics(h)
              const weight = summary.totalValue > 0 ? (metrics.marketValue / summary.totalValue) * 100 : 0
              const isPositive = h.dayChangePercent >= 0
              const isPnlPositive = metrics.unrealizedPnL >= 0
              const badge = symbolColors[h.symbol] || { bg: 'bg-brand-blue/20', text: 'text-brand-blue' }

              return (
                <tr key={h.id} className="hover:bg-background-hover/50 transition">
                  {/* Asset */}
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                        {h.symbol[0]}
                      </span>
                      <span className="font-bold text-content-primary">{h.symbol}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-2.5 text-right font-medium text-content-primary tabular-nums">
                    ${h.currentPrice.toFixed(2)}
                  </td>

                  {/* Weight */}
                  <td className="py-2.5 text-right font-medium text-content-secondary tabular-nums">
                    {weight.toFixed(1)}%
                  </td>

                  {/* Day Change */}
                  <td
                    className={`py-2.5 text-right font-semibold tabular-nums ${
                      isPositive ? 'text-financial-positive' : 'text-financial-negative'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {h.dayChangePercent.toFixed(2)}%
                  </td>

                  {/* P&L */}
                  <td
                    className={`py-2.5 text-right font-semibold tabular-nums ${
                      isPnlPositive ? 'text-financial-positive' : 'text-financial-negative'
                    }`}
                  >
                    {isPnlPositive ? '+' : '-'}${Math.abs(Math.round(metrics.unrealizedPnL)).toLocaleString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
