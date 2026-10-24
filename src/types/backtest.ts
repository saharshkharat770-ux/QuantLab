export type StrategyType =
  | 'BUY_AND_HOLD'
  | 'SMA_CROSSOVER'
  | 'PERIODIC_REBALANCE'
  | 'MOMENTUM'
  | 'VOLATILITY_TARGET'

export interface BacktestConfig {
  strategy: StrategyType
  symbol: string
  benchmarkSymbol: string
  startDate: string
  endDate: string
  initialCapital: number
  rebalanceFrequencyDays?: number
  shortWindow?: number // For SMA crossover, e.g. 20
  longWindow?: number // For SMA crossover, e.g. 50
  transactionCostBps: number // e.g. 10 bps (0.10%)
  slippageBps: number // e.g. 5 bps
}

export interface TradeRecord {
  id: string
  date: string
  symbol: string
  action: 'BUY' | 'SELL'
  price: number
  shares: number
  fee: number
  portfolioValueAfter: number
}

export interface BacktestResult {
  cumulativeReturnPercent: number
  benchmarkReturnPercent: number
  cagrPercent: number
  annualizedVolatilityPercent: number
  sharpeRatio: number
  maxDrawdownPercent: number
  winRatePercent: number
  totalTrades: number
  totalFeesPaid: number
  finalPortfolioValue: number
  equityCurve: Array<{
    date: string
    strategyValue: number
    benchmarkValue: number
    strategyReturnPercent: number
    benchmarkReturnPercent: number
    cash: number
    drawdownPercent: number
  }>
  trades: TradeRecord[]
  monthlyReturns: Array<{
    year: number
    month: string
    strategyReturn: number
    benchmarkReturn: number
  }>
}
