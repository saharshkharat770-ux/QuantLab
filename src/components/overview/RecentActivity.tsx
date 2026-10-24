import React from 'react'
import { ArrowRight, ArrowUpRight, ArrowDownRight, DollarSign, RefreshCw, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ActivityEvent } from '../../types/portfolio'

export const RecentActivity: React.FC = () => {
  const { activities, setCurrentView } = useApp()

  const displayActivities = activities.slice(0, 5)

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'BUY':
        return (
          <div className="w-7 h-7 rounded-full bg-financial-positive/20 text-financial-positive flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        )
      case 'SELL':
        return (
          <div className="w-7 h-7 rounded-full bg-financial-negative/20 text-financial-negative flex items-center justify-center shrink-0">
            <ArrowDownRight className="w-3.5 h-3.5" />
          </div>
        )
      case 'DIVIDEND':
        return (
          <div className="w-7 h-7 rounded-full bg-brand-cyan/20 text-brand-cyan flex items-center justify-center shrink-0">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        )
      case 'REBALANCE':
        return (
          <div className="w-7 h-7 rounded-full bg-brand-violet/20 text-brand-violet flex items-center justify-center shrink-0">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
        )
      case 'WATCHLIST':
        return (
          <div className="w-7 h-7 rounded-full bg-financial-warning/20 text-financial-warning flex items-center justify-center shrink-0">
            <Star className="w-3.5 h-3.5" />
          </div>
        )
      default:
        return (
          <div className="w-7 h-7 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center shrink-0">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        )
    }
  }

  return (
    <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel flex flex-col justify-between">
      {/* Header with View All -> link */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h3 className="text-sm font-bold text-content-primary">Recent Activity</h3>
        <button
          onClick={() => setCurrentView('reports')}
          className="text-xs font-semibold text-brand-blue hover:text-brand-cyan flex items-center gap-1 transition group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Activity List Matching Reference Exactly */}
      <div className="space-y-3 my-1">
        {displayActivities.map((act) => {
          const hasAmount = act.amount !== undefined && act.amount !== 0
          const isPositive = (act.amount ?? 0) > 0

          return (
            <div key={act.id} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                {getEventIcon(act.type)}
                <div className="min-w-0">
                  <div className="font-semibold text-content-primary truncate">{act.title}</div>
                  <div className="text-[10px] text-content-muted">{act.timestamp}</div>
                </div>
              </div>

              {/* Amount or Dash */}
              <div className="shrink-0 text-right">
                {hasAmount ? (
                  <span
                    className={`font-bold tabular-nums ${
                      isPositive ? 'text-financial-positive' : 'text-financial-negative'
                    }`}
                  >
                    {isPositive ? '+' : '-'}${Math.abs(Math.round(act.amount!)).toLocaleString()}
                  </span>
                ) : (
                  <span className="text-content-muted font-bold">—</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
