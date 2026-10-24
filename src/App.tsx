import React, { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { NotificationsToast } from './components/layout/NotificationsToast'
import { CommandPalette } from './components/layout/CommandPalette'
import { AddAssetModal } from './components/modals/AddAssetModal'
import { AiAnalystModal } from './components/ai/AiAnalystModal'

// Views
import { OverviewDashboard } from './components/overview/OverviewDashboard'
import { PortfolioView } from './features/portfolio/PortfolioView'
import { MarketsView } from './features/markets/MarketsView'
import { RiskLabView } from './features/risk-lab/RiskLabView'
import { BacktestView } from './features/backtest/BacktestView'
import { ScenarioView } from './features/scenario-studio/ScenarioView'
import { ReportsView } from './features/reports/ReportsView'
import { WatchlistView } from './features/watchlist/WatchlistView'
import { SettingsView } from './features/settings/SettingsView'

const MainContent: React.FC = () => {
  const { currentView, setIsCommandPaletteOpen } = useApp()

  // Global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setIsCommandPaletteOpen])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-content-primary">
      {/* Primary Left Navigation Rail matching Reference */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background focus:outline-none" tabIndex={0}>
          {currentView === 'overview' && <OverviewDashboard />}
          {currentView === 'portfolio' && <PortfolioView />}
          {currentView === 'markets' && <MarketsView />}
          {currentView === 'risk-lab' && <RiskLabView />}
          {currentView === 'backtesting' && <BacktestView />}
          {currentView === 'scenario-studio' && <ScenarioView />}
          {currentView === 'reports' && <ReportsView />}
          {currentView === 'watchlist' && <WatchlistView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <CommandPalette />
      <AddAssetModal />
      <AiAnalystModal />
      <NotificationsToast />
    </div>
  )
}

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  )
}

export default App
