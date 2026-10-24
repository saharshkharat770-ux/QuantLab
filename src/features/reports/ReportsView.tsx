import React from 'react'
import { FileText, Download, Printer, Shield, CheckCircle2, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateHoldingMetrics } from '../../engine/portfolio/calculations'

export const ReportsView: React.FC = () => {
  const { summary, holdings, activities, formatCurrency, addNotification } = useApp()

  const handlePrint = () => {
    window.print()
    addNotification('Report Sent to Print', 'Institutional Fact Sheet formatted for PDF/printer.', 'info')
  }

  const exportHoldingsCSV = () => {
    const headers = ['Symbol,Name,Asset Class,Quantity,Buy Price,Current Price,Market Value,Unrealized PnL,Weight%']
    const rows = holdings.map((h) => {
      const metrics = calculateHoldingMetrics(h)
      const weight = ((metrics.marketValue / summary.totalValue) * 100).toFixed(2)
      return `"${h.symbol}","${h.name}","${h.assetClass}",${h.quantity},${h.buyPrice},${h.currentPrice},${metrics.marketValue.toFixed(2)},${metrics.unrealizedPnL.toFixed(2)},${weight}%`
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `quantlab_portfolio_factsheet_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addNotification('CSV Exported', 'Holdings data downloaded.', 'success')
  }

  const exportActivitiesCSV = () => {
    const headers = ['Type,Title,Description,Timestamp,Amount,Symbol']
    const rows = activities.map((a) => {
      return `"${a.type}","${a.title}","${a.description}","${a.timestamp}",${a.amount || 0},"${a.symbol || ''}"`
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `quantlab_activities_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addNotification('Activities CSV Exported', 'Activity log downloaded.', 'success')
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-background-surface shadow-panel">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-content-primary">Reports & Fact Sheets</h1>
          </div>
          <p className="mt-1 text-xs text-content-muted">
            Institutional portfolio reporting, audit logs, and compliant printable fact sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-background-elevated hover:border-brand-cyan text-content-secondary hover:text-content-primary text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Print Fact Sheet</span>
          </button>

          <button
            onClick={exportHoldingsCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-blue hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-glow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Data</span>
          </button>
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-border bg-background-surface shadow-panel flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-sm font-bold text-content-primary">Holdings Master Export</div>
            <p className="text-xs text-content-muted max-w-sm">
              Includes position quantities, purchase cost basis, live market prices, unrealized profit/loss, and portfolio weights.
            </p>
          </div>
          <button
            onClick={exportHoldingsCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background-elevated hover:border-brand-cyan text-xs font-semibold text-content-secondary hover:text-content-primary transition"
          >
            <Download className="w-3.5 h-3.5 text-brand-teal" />
            <span>CSV</span>
          </button>
        </div>

        <div className="p-5 rounded-xl border border-border bg-background-surface shadow-panel flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-sm font-bold text-content-primary">Execution & Activity Log</div>
            <p className="text-xs text-content-muted max-w-sm">
              Full transaction log containing trade executions, dividend credits, rebalancing logs, and timestamped actions.
            </p>
          </div>
          <button
            onClick={exportActivitiesCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background-elevated hover:border-brand-cyan text-xs font-semibold text-content-secondary hover:text-content-primary transition"
          >
            <Download className="w-3.5 h-3.5 text-brand-teal" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Printable Institutional Fact Sheet Preview */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-6 shadow-panel space-y-5 print:border-none print:shadow-none">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <div className="text-lg font-black tracking-tight text-content-primary">
              QUANT<span className="text-brand-cyan">LAB</span> PORTFOLIO AUDIT REPORT
            </div>
            <div className="text-xs text-content-muted mt-0.5">
              Generated for Account: SAHARSH · Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-bold text-content-primary">Status: VERIFIED DEMO</div>
            <div className="text-content-muted text-[10px]">Methodology: Non-parametric empirical</div>
          </div>
        </div>

        {/* Fact Sheet Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-border bg-background-elevated text-xs">
          <div>
            <span className="text-content-muted">Total Portfolio NAV</span>
            <div className="text-base font-extrabold text-content-primary tabular-nums mt-0.5">
              {formatCurrency(summary.totalValue)}
            </div>
          </div>
          <div>
            <span className="text-content-muted">Unrealized P&L</span>
            <div className="text-base font-extrabold text-financial-positive tabular-nums mt-0.5">
              +{formatCurrency(summary.unrealizedPnL)} ({summary.unrealizedPnLPercent.toFixed(1)}%)
            </div>
          </div>
          <div>
            <span className="text-content-muted">Annualized Volatility</span>
            <div className="text-base font-extrabold text-content-primary tabular-nums mt-0.5">
              {summary.annualizedVolatility.toFixed(2)}%
            </div>
          </div>
          <div>
            <span className="text-content-muted">Sharpe Ratio</span>
            <div className="text-base font-extrabold text-brand-cyan tabular-nums mt-0.5">
              {summary.sharpeRatio.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Audit Statement */}
        <div className="p-4 rounded-xl border border-border/60 bg-background-surface/50 text-xs text-content-muted space-y-2">
          <div className="flex items-center gap-2 font-bold text-content-secondary">
            <Shield className="w-4 h-4 text-brand-cyan" />
            <span>Regulatory & Quantitative Disclosure</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            This document constitutes a quantitative analytics factsheet. Historical simulations, empirical Value at Risk (VaR), and scenario projections are calculated for analytical exploration. 
            Past performance does not guarantee future results. Zero live brokerage trades are executed.
          </p>
        </div>
      </div>
    </div>
  )
}
