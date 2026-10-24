import React, { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'

export const HeroBanner: React.FC = () => {
  const [timeStr, setTimeStr] = useState('03:45:27 PM')
  const dateStr = 'Tue, Oct 22, 2024'

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-background-surface via-background-elevated to-background-surface p-6 shadow-panel">
      {/* Background Constellation Map Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 240"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#168BFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Network Connection Lines */}
          <g stroke="#168BFF" strokeWidth="0.75" strokeOpacity="0.35" fill="none">
            <line x1="120" y1="40" x2="260" y2="90" />
            <line x1="260" y1="90" x2="420" y2="60" />
            <line x1="420" y1="60" x2="580" y2="120" />
            <line x1="580" y1="120" x2="740" y2="70" />
            <line x1="740" y1="70" x2="890" y2="110" />
            <line x1="260" y1="90" x2="340" y2="160" />
            <line x1="420" y1="60" x2="500" y2="170" />
            <line x1="580" y1="120" x2="660" y2="190" />
            <line x1="740" y1="70" x2="820" y2="160" />
            <line x1="340" y1="160" x2="500" y2="170" />
            <line x1="500" y1="170" x2="660" y2="190" />
            <line x1="660" y1="190" x2="820" y2="160" />
          </g>

          {/* Glowing Constellation Nodes */}
          <g fill="#22D3EE">
            <circle cx="120" cy="40" r="2.5" />
            <circle cx="260" cy="90" r="3.5" filter="url(#glow)" />
            <circle cx="420" cy="60" r="3" />
            <circle cx="580" cy="120" r="4" />
            <circle cx="740" cy="70" r="3.5" />
            <circle cx="890" cy="110" r="2.5" />
            <circle cx="340" cy="160" r="2.5" />
            <circle cx="500" cy="170" r="3.5" />
            <circle cx="660" cy="190" r="3" />
            <circle cx="820" cy="160" r="2.5" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Greetings & Title */}
        <div>
          <div className="text-[10px] font-bold tracking-widest text-content-muted uppercase">
            Welcome Back, Saharsh
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
            Portfolio Intelligence
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-content-secondary">
            Risk, performance, and allocation in one view.
          </p>
        </div>

        {/* Right: Timestamp & Global Markets Insight Badge */}
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <div className="text-right">
            <div className="text-xs font-semibold text-content-secondary">{dateStr}</div>
            <div className="text-[11px] font-mono text-content-muted tabular-nums">{timeStr}</div>
          </div>

          {/* Micro Information Card */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-border/80 bg-background-sidebar/80 backdrop-blur shadow-sm">
            <div className="text-[10px] space-y-0.5 text-right font-medium">
              <div className="text-content-secondary uppercase tracking-wider text-[9px] font-bold">
                Global Markets
              </div>
              <div className="text-brand-cyan font-semibold text-[10px]">Real-Time Insights</div>
              <div className="text-content-muted text-[9px]">AI-Powered Analytics</div>
            </div>
            <div className="w-8 h-8 rounded-md bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
              <BarChart3 className="w-4 h-4 text-brand-cyan" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
