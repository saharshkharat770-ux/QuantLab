export type AssetClass = 'Equities' | 'Bonds' | 'ETFs' | 'Cash' | 'Crypto' | 'Commodities'

export interface Holding {
  id: string
  symbol: string
  name: string
  assetClass: AssetClass
  sector?: string
  quantity: number
  buyPrice: number
  currentPrice: number
  dayChangePercent: number
  currency: string
  logoUrl?: string
  lastUpdated: string
}

export interface PortfolioSummary {
  totalValue: number
  totalCostBasis: number
  unrealizedPnL: number
  unrealizedPnLPercent: number
  dailyPnL: number
  dailyPnLPercent: number
  annualizedVolatility: number
  sharpeRatio: number
  cashBalance: number
  holdingsCount: number
}

export interface HistoricalPricePoint {
  date: string
  portfolioValue: number
  portfolioReturnPercent: number
  benchmarkReturnPercent: number
  benchmarkValue: number
}

export interface ActivityEvent {
  id: string
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'REBALANCE' | 'WATCHLIST'
  title: string
  description: string
  timestamp: string
  amount?: number
  symbol?: string
}

export interface AllocationItem {
  category: string
  percentage: number
  value: number
  color: string
}
