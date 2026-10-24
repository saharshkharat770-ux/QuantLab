import { Holding, PortfolioSummary, AllocationItem } from '../../types/portfolio'

export function calculateHoldingMetrics(holding: Holding) {
  const marketValue = holding.quantity * holding.currentPrice
  const costBasis = holding.quantity * holding.buyPrice
  const unrealizedPnL = marketValue - costBasis
  const unrealizedPnLPercent = costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0
  const dailyPnL = marketValue * (holding.dayChangePercent / 100)

  return {
    marketValue,
    costBasis,
    unrealizedPnL,
    unrealizedPnLPercent,
    dailyPnL,
  }
}

export function calculatePortfolioSummary(
  holdings: Holding[],
  cashBalance: number,
  annualizedVolOverride?: number,
  sharpeOverride?: number
): PortfolioSummary {
  let totalHoldingsValue = 0
  let totalCostBasis = 0
  let dailyPnL = 0

  for (const h of holdings) {
    const metrics = calculateHoldingMetrics(h)
    totalHoldingsValue += metrics.marketValue
    totalCostBasis += metrics.costBasis
    dailyPnL += metrics.dailyPnL
  }

  const totalValue = totalHoldingsValue + cashBalance
  const unrealizedPnL = totalHoldingsValue - totalCostBasis
  const unrealizedPnLPercent = totalCostBasis > 0 ? (unrealizedPnL / totalCostBasis) * 100 : 0
  const prevDayTotal = totalValue - dailyPnL
  const dailyPnLPercent = prevDayTotal > 0 ? (dailyPnL / prevDayTotal) * 100 : 0

  return {
    totalValue,
    totalCostBasis: totalCostBasis + cashBalance,
    unrealizedPnL,
    unrealizedPnLPercent,
    dailyPnL,
    dailyPnLPercent,
    annualizedVolatility: annualizedVolOverride ?? 14.82,
    sharpeRatio: sharpeOverride ?? 1.47,
    cashBalance,
    holdingsCount: holdings.length,
  }
}

export function calculateAllocationBreakdown(
  holdings: Holding[],
  cashBalance: number
): AllocationItem[] {
  let totalValue = cashBalance
  const classTotals: Record<string, number> = {
    Equities: 0,
    Bonds: 0,
    ETFs: 0,
    Cash: cashBalance,
    Crypto: 0,
    Commodities: 0,
  }

  for (const h of holdings) {
    const val = h.quantity * h.currentPrice
    classTotals[h.assetClass] = (classTotals[h.assetClass] || 0) + val
    totalValue += val
  }

  if (totalValue <= 0) return []

  const colors: Record<string, string> = {
    Equities: '#22D3EE', // Cyan
    Bonds: '#00D6A0', // Teal
    ETFs: '#FFB547', // Amber/Orange
    Cash: '#9A7BFF', // Violet
    Crypto: '#FF647C', // Red/Coral
    Commodities: '#EAF2FF', // Ice
  }

  const results: AllocationItem[] = []
  const order: Array<keyof typeof classTotals> = ['Equities', 'Bonds', 'ETFs', 'Cash']

  for (const category of order) {
    const val = classTotals[category] || 0
    if (val > 0) {
      results.push({
        category,
        value: val,
        percentage: (val / totalValue) * 100,
        color: colors[category] || '#168BFF',
      })
    }
  }

  // Include any other categories with non-zero allocation
  for (const [category, val] of Object.entries(classTotals)) {
    if (!order.includes(category as any) && val > 0) {
      results.push({
        category,
        value: val,
        percentage: (val / totalValue) * 100,
        color: colors[category] || '#168BFF',
      })
    }
  }

  return results
}
