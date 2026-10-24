import React from 'react'
import {
  Home,
  Briefcase,
  TrendingUp,
  Activity,
  LineChart,
  Sliders,
  FileText,
  Star,
  Settings,
  Sparkles,
} from 'lucide-react'
import { useApp, NavView } from '../../context/AppContext'

interface NavItem {
  id: NavView
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'markets', label: 'Markets', icon: TrendingUp },
  { id: 'risk-lab', label: 'Risk Lab', icon: Activity },
  { id: 'backtesting', label: 'Backtesting', icon: LineChart },
  { id: 'scenario-studio', label: 'Scenario Studio', icon: Sliders },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'watchlist', label: 'Watchlist', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, setIsAiModalOpen } = useApp()

  return (
    <aside className="w-64 bg-background-sidebar border-r border-border flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      {/* Top Header / Branding */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-border/60">
          {/* Logo Hexagonal Cube Icon */}
          <div className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue/30 to-brand-cyan/20 border border-brand-cyan/40 shadow-glow-cyan">
            <svg
              className="w-5 h-5 text-brand-cyan"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <div className="text-base font-extrabold tracking-wider text-content-primary">
              QUANT<span className="text-brand-cyan">LAB</span>
            </div>
            <div className="text-[9px] font-semibold tracking-widest text-content-muted uppercase">
              Analyze · Simulate · Invest
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                aria-label={`Navigate to ${item.label}`}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-blue/25 to-brand-blue/10 text-brand-cyan border border-brand-blue/40 shadow-sm font-semibold'
                    : 'text-content-secondary hover:text-content-primary hover:bg-background-hover/60 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-brand-cyan' : 'text-content-muted'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom AI Market Analyst Card (Matching Reference Screen Exactly) */}
      <div className="p-4 m-3 rounded-xl border border-border/80 bg-gradient-to-b from-background-surface to-background-elevated shadow-panel">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-violet shadow-glow-violet">
            <Sparkles className="w-4 h-4 text-brand-violet" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-content-primary">AI Market Analyst</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-brand-violet/25 text-brand-violet border border-brand-violet/30">
                BETA
              </span>
            </div>
          </div>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-content-muted">
          Get AI-powered insights on your portfolio, markets and risks.
        </p>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="mt-3 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-brand-blue to-[#1d6eed] hover:brightness-110 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-glow transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Ask AI</span>
        </button>
      </div>
    </aside>
  )
}
