import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Home,
  Briefcase,
  TrendingUp,
  Activity,
  LineChart,
  Sliders,
  FileText,
  Star,
  Settings,
  Plus,
  RotateCcw,
  Download,
  Sparkles,
} from 'lucide-react'
import { useApp, NavView } from '../../context/AppContext'

interface CommandItem {
  id: string
  label: string
  category: 'Navigation' | 'Actions'
  icon: React.ComponentType<{ className?: string }>
  action: () => void
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setCurrentView,
    setIsAddAssetModalOpen,
    setIsAiModalOpen,
    resetDemoData,
    addNotification,
  } = useApp()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isCommandPaletteOpen])

  const commands: CommandItem[] = [
    {
      id: 'nav-overview',
      label: 'Go to Overview Dashboard',
      category: 'Navigation',
      icon: Home,
      action: () => setCurrentView('overview'),
    },
    {
      id: 'nav-portfolio',
      label: 'Go to Portfolio Workspace',
      category: 'Navigation',
      icon: Briefcase,
      action: () => setCurrentView('portfolio'),
    },
    {
      id: 'nav-markets',
      label: 'Go to Markets Intelligence',
      category: 'Navigation',
      icon: TrendingUp,
      action: () => setCurrentView('markets'),
    },
    {
      id: 'nav-risklab',
      label: 'Go to Risk Lab',
      category: 'Navigation',
      icon: Activity,
      action: () => setCurrentView('risk-lab'),
    },
    {
      id: 'nav-backtesting',
      label: 'Go to Backtesting Lab',
      category: 'Navigation',
      icon: LineChart,
      action: () => setCurrentView('backtesting'),
    },
    {
      id: 'nav-scenario',
      label: 'Go to Scenario Studio',
      category: 'Navigation',
      icon: Sliders,
      action: () => setCurrentView('scenario-studio'),
    },
    {
      id: 'nav-reports',
      label: 'Go to Reports & Exports',
      category: 'Navigation',
      icon: FileText,
      action: () => setCurrentView('reports'),
    },
    {
      id: 'nav-watchlist',
      label: 'Go to Watchlist',
      category: 'Navigation',
      icon: Star,
      action: () => setCurrentView('watchlist'),
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      category: 'Navigation',
      icon: Settings,
      action: () => setCurrentView('settings'),
    },
    {
      id: 'act-add-asset',
      label: 'Add New Asset to Portfolio',
      category: 'Actions',
      icon: Plus,
      action: () => setIsAddAssetModalOpen(true),
    },
    {
      id: 'act-ask-ai',
      label: 'Open AI Market Analyst',
      category: 'Actions',
      icon: Sparkles,
      action: () => setIsAiModalOpen(true),
    },
    {
      id: 'act-reset',
      label: 'Reset Verified Demo Data',
      category: 'Actions',
      icon: RotateCcw,
      action: () => resetDemoData(),
    },
  ]

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action()
        setIsCommandPaletteOpen(false)
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false)
    }
  }

  if (!isCommandPaletteOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-background-surface shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-background-elevated">
          <Search className="w-4 h-4 text-brand-cyan" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or navigate anywhere..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-content-primary placeholder:text-content-muted focus:outline-none"
          />
          <kbd className="text-[10px] font-mono bg-background-surface border border-border px-1.5 py-0.5 rounded text-content-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-content-muted">No commands found.</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action()
                    setIsCommandPaletteOpen(false)
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                    isSelected
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'text-content-secondary hover:text-content-primary hover:bg-background-hover'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      isSelected ? 'text-white/80' : 'text-content-muted'
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
