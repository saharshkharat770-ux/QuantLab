import React from 'react'
import { useApp } from '../../context/AppContext'
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react'

export const NotificationsToast: React.FC = () => {
  const { notifications, removeNotification } = useApp()

  if (notifications.length === 0) return null

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="System Notifications"
    >
      {notifications.map((n) => {
        const icon =
          n.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : n.type === 'error' ? (
            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : n.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          )

        const borderColor =
          n.type === 'success'
            ? 'border-emerald-500/30 bg-emerald-950/40'
            : n.type === 'error'
            ? 'border-rose-500/30 bg-rose-950/40'
            : n.type === 'warning'
            ? 'border-amber-500/30 bg-amber-950/40'
            : 'border-sky-500/30 bg-sky-950/40'

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borderColor}`}
            style={{ backgroundColor: 'rgba(10, 21, 36, 0.95)' }}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-100 leading-tight">
                {n.title}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug break-words">
                {n.message}
              </div>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 -mr-1 -mt-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
