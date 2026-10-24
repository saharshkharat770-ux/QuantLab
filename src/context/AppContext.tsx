import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Holding, ActivityEvent, PortfolioSummary, AllocationItem } from '../types/portfolio'
import { WatchlistItem, MarketIndexSummary } from '../types/market'
import { INITIAL_HOLDINGS, INITIAL_CASH_BALANCE, INITIAL_ACTIVITIES } from '../data/demo/portfolio'
import { INITIAL_WATCHLIST, MARKET_INDICES } from '../data/demo/assets'
import { calculatePortfolioSummary, calculateAllocationBreakdown } from '../engine/portfolio/calculations'

export type NavView =
  | 'overview'
  | 'portfolio'
  | 'markets'
  | 'risk-lab'
  | 'backtesting'
  | 'scenario-studio'
  | 'reports'
  | 'watchlist'
  | 'settings'

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'

export interface ToastNotification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  timestamp: number
}

interface AppContextType {
  currentView: NavView
  setCurrentView: (view: NavView) => void
  timeframe: Timeframe
  setTimeframe: (tf: Timeframe) => void
  benchmark: string
  setBenchmark: (b: string) => void
  holdings: Holding[]
  cashBalance: number
  activities: ActivityEvent[]
  watchlist: WatchlistItem[]
  marketIndices: MarketIndexSummary[]
  summary: PortfolioSummary
  allocation: AllocationItem[]
  isCommandPaletteOpen: boolean
  setIsCommandPaletteOpen: (open: boolean) => void
  isAddAssetModalOpen: boolean
  setIsAddAssetModalOpen: (open: boolean) => void
  isAiModalOpen: boolean
  setIsAiModalOpen: (open: boolean) => void
  notifications: ToastNotification[]
  addNotification: (title: string, message: string, type?: ToastNotification['type']) => void
  removeNotification: (id: string) => void
  addHolding: (holding: Omit<Holding, 'id' | 'lastUpdated'>) => void
  updateHolding: (id: string, updates: Partial<Holding>) => void
  removeHolding: (id: string) => void
  rebalanceHoldings: (targetWeights: Record<string, number>) => void
  addToWatchlist: (item: Omit<WatchlistItem, 'addedDate'>) => void
  removeFromWatchlist: (symbol: string) => void
  resetDemoData: () => void
  currency: 'USD' | 'EUR' | 'GBP' | 'INR'
  setCurrency: (c: 'USD' | 'EUR' | 'GBP' | 'INR') => void
  currencySymbol: string
  formatCurrency: (amount: number, compact?: boolean) => string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_PREFIX = 'quantlab_v1_'

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<NavView>('overview')
  const [timeframe, setTimeframe] = useState<Timeframe>('ALL')
  const [benchmark, setBenchmark] = useState<string>('S&P 500')
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('USD')

  // Modals & Overlay state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [notifications, setNotifications] = useState<ToastNotification[]>([])

  // State with LocalStorage persistence
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}holdings`)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Failed to parse saved holdings, using default', e)
    }
    return INITIAL_HOLDINGS
  })

  const [cashBalance, setCashBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}cash`)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Failed to parse saved cash, using default', e)
    }
    return INITIAL_CASH_BALANCE
  })

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}activities`)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Failed to parse saved activities, using default', e)
    }
    return INITIAL_ACTIVITIES
  })

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}watchlist`)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Failed to parse saved watchlist, using default', e)
    }
    return INITIAL_WATCHLIST
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}holdings`, JSON.stringify(holdings))
  }, [holdings])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}cash`, JSON.stringify(cashBalance))
  }, [cashBalance])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}activities`, JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}watchlist`, JSON.stringify(watchlist))
  }, [watchlist])

  // Global Keyboard Shortcuts (Ctrl+K for Command Palette)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false)
        setIsAddAssetModalOpen(false)
        setIsAiModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Notification helper
  const addNotification = (
    title: string,
    message: string,
    type: ToastNotification['type'] = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    const newToast: ToastNotification = { id, title, message, type, timestamp: Date.now() }
    setNotifications((prev) => [newToast, ...prev].slice(0, 5))

    setTimeout(() => {
      setNotifications((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((t) => t.id !== id))
  }

  // Portfolio actions
  const addHolding = (item: Omit<Holding, 'id' | 'lastUpdated'>) => {
    const id = `h-${item.symbol.toLowerCase()}-${Date.now()}`
    const newHolding: Holding = {
      ...item,
      id,
      lastUpdated: new Date().toISOString().slice(0, 10),
    }

    setHoldings((prev) => {
      const existingIdx = prev.findIndex((h) => h.symbol === item.symbol)
      if (existingIdx >= 0) {
        // Average up
        const ex = prev[existingIdx]
        const totalQty = ex.quantity + item.quantity
        const avgBuy = (ex.quantity * ex.buyPrice + item.quantity * item.buyPrice) / totalQty
        const updated = [...prev]
        updated[existingIdx] = {
          ...ex,
          quantity: totalQty,
          buyPrice: avgBuy,
          currentPrice: item.currentPrice,
        }
        return updated
      }
      return [...prev, newHolding]
    })

    const cost = item.quantity * item.buyPrice
    setCashBalance((prev) => Math.max(0, prev - cost))

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'BUY',
      title: `Bought ${item.quantity} shares of ${item.symbol}`,
      description: `Executed at $${item.buyPrice.toFixed(2)}`,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      amount: -cost,
      symbol: item.symbol,
    }
    setActivities((prev) => [newActivity, ...prev])
    addNotification('Asset Added', `${item.symbol} added to portfolio successfully.`, 'success')
  }

  const updateHolding = (id: string, updates: Partial<Holding>) => {
    setHoldings((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)))
    addNotification('Holding Updated', `Position parameters updated.`, 'info')
  }

  const removeHolding = (id: string) => {
    const target = holdings.find((h) => h.id === id)
    if (!target) return
    const proceed = target.quantity * target.currentPrice
    setHoldings((prev) => prev.filter((h) => h.id !== id))
    setCashBalance((prev) => prev + proceed)

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'SELL',
      title: `Sold ${target.quantity} shares of ${target.symbol}`,
      description: `Liquidated at $${target.currentPrice.toFixed(2)}`,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      amount: proceed,
      symbol: target.symbol,
    }
    setActivities((prev) => [newActivity, ...prev])
    addNotification('Holding Liquidated', `${target.symbol} position sold into cash.`, 'info')
  }

  const rebalanceHoldings = (targetWeights: Record<string, number>) => {
    const currentSummary = calculatePortfolioSummary(holdings, cashBalance)
    const totalVal = currentSummary.totalValue

    const updated = holdings.map((h) => {
      const targetPercent = targetWeights[h.symbol] ?? (100 / (holdings.length + 1))
      const targetDollars = (targetPercent / 100) * totalVal
      const newQty = targetDollars / h.currentPrice
      return {
        ...h,
        quantity: Number(newQty.toFixed(2)),
      }
    })

    const newHoldingsVal = updated.reduce((s, h) => s + h.quantity * h.currentPrice, 0)
    setHoldings(updated)
    setCashBalance(Math.max(0, totalVal - newHoldingsVal))

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'REBALANCE',
      title: 'Rebalanced portfolio (Manual)',
      description: 'Realigned asset weights to target allocations',
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    setActivities((prev) => [newActivity, ...prev])
    addNotification('Portfolio Rebalanced', 'All positions realigned to target weights.', 'success')
  }

  const addToWatchlist = (item: Omit<WatchlistItem, 'addedDate'>) => {
    if (watchlist.some((w) => w.symbol === item.symbol)) {
      addNotification('Already in Watchlist', `${item.symbol} is already tracked.`, 'warning')
      return
    }
    const newItem: WatchlistItem = {
      ...item,
      addedDate: new Date().toISOString().slice(0, 10),
    }
    setWatchlist((prev) => [...prev, newItem])
    addNotification('Watchlist Updated', `${item.symbol} added to watchlist.`, 'success')
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((w) => w.symbol !== symbol))
    addNotification('Watchlist Item Removed', `${symbol} removed from tracking.`, 'info')
  }

  const resetDemoData = () => {
    setHoldings(INITIAL_HOLDINGS)
    setCashBalance(INITIAL_CASH_BALANCE)
    setActivities(INITIAL_ACTIVITIES)
    setWatchlist(INITIAL_WATCHLIST)
    setTimeframe('ALL')
    setBenchmark('S&P 500')
    localStorage.removeItem(`${STORAGE_PREFIX}holdings`)
    localStorage.removeItem(`${STORAGE_PREFIX}cash`)
    localStorage.removeItem(`${STORAGE_PREFIX}activities`)
    localStorage.removeItem(`${STORAGE_PREFIX}watchlist`)
    addNotification('Demo Data Reset', 'Restored verified default demonstration portfolio.', 'info')
  }

  // Derived summaries
  const summary = calculatePortfolioSummary(holdings, cashBalance, 14.82, 1.47)
  const allocation = calculateAllocationBreakdown(holdings, cashBalance)

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  }
  const currencySymbol = currencySymbols[currency] || '$'

  const formatCurrency = (amount: number, compact: boolean = false) => {
    if (compact) {
      if (Math.abs(amount) >= 1_000_000) {
        return `${currencySymbol}${(amount / 1_000_000).toFixed(1)}M`
      }
      if (Math.abs(amount) >= 1_000) {
        return `${currencySymbol}${(amount / 1_000).toFixed(1)}K`
      }
    }
    return `${currencySymbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        timeframe,
        setTimeframe,
        benchmark,
        setBenchmark,
        holdings,
        cashBalance,
        activities,
        watchlist,
        marketIndices: MARKET_INDICES,
        summary,
        allocation,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAddAssetModalOpen,
        setIsAddAssetModalOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        notifications,
        addNotification,
        removeNotification,
        addHolding,
        updateHolding,
        removeHolding,
        rebalanceHoldings,
        addToWatchlist,
        removeFromWatchlist,
        resetDemoData,
        currency,
        setCurrency,
        currencySymbol,
        formatCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
