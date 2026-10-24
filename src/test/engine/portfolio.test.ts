import { describe, it, expect } from 'vitest'
import {
  calculateHoldingMetrics,
  calculatePortfolioSummary,
  calculateAllocationBreakdown,
} from '../../engine/portfolio/calculations'
import { INITIAL_HOLDINGS, INITIAL_CASH_BALANCE } from '../../data/demo/portfolio'
import { Holding } from '../../types/portfolio'

describe('Portfolio Engine Calculations', () => {
  it('correctly calculates holding market value and profit/loss metrics', () => {
    const rawHolding: Holding = {
      id: 'h-test',
      symbol: 'TEST',
      name: 'Test Corporation',
      assetClass: 'Equities',
      sector: 'Technology',
      quantity: 100,
      buyPrice: 150.0,
      currentPrice: 180.0,
      dayChangePercent: 2.5,
      currency: 'USD',
      lastUpdated: '2024-08-14',
    }

    const computed = calculateHoldingMetrics(rawHolding)

    // Market value = 100 * 180 = 18,000
    expect(computed.marketValue).toBe(18000)
    // Cost basis = 100 * 150 = 15,000
    expect(computed.costBasis).toBe(15000)
    // Unrealized PnL = 18,000 - 15,000 = +3,000 (+20%)
    expect(computed.unrealizedPnL).toBe(3000)
    expect(computed.unrealizedPnLPercent).toBe(20)
    // Daily PnL = 18,000 * (2.5 / 100) = 450
    expect(computed.dailyPnL).toBe(450)
  })

  it('calculates portfolio summary matching reference baseline values', () => {
    const summary = calculatePortfolioSummary(INITIAL_HOLDINGS, INITIAL_CASH_BALANCE)

    // Portfolio total should equal $248,560.42 within cents
    expect(summary.totalValue).toBeCloseTo(248560.42, 0)

    // Daily change matches reference: +$2,184.76 (+0.89%)
    expect(summary.dailyPnL).toBeCloseTo(2184.76, 0)
    expect(summary.dailyPnLPercent).toBeCloseTo(0.89, 1)

    // Total cost basis should be positive
    expect(summary.totalCostBasis).toBeGreaterThan(0)
    // Total return should be positive
    expect(summary.unrealizedPnL).toBeGreaterThan(0)
    expect(summary.cashBalance).toBe(INITIAL_CASH_BALANCE)
    expect(summary.holdingsCount).toBe(INITIAL_HOLDINGS.length)
  })

  it('correctly aggregates asset class allocation matching reference breakdown', () => {
    const breakdown = calculateAllocationBreakdown(INITIAL_HOLDINGS, INITIAL_CASH_BALANCE)

    // Should include Equities, Bonds, ETFs, Cash
    const equityAlloc = breakdown.find((b) => b.category === 'Equities')
    const bondAlloc = breakdown.find((b) => b.category === 'Bonds')
    const etfAlloc = breakdown.find((b) => b.category === 'ETFs')
    const cashAlloc = breakdown.find((b) => b.category === 'Cash')

    expect(equityAlloc).toBeDefined()
    expect(bondAlloc).toBeDefined()
    expect(etfAlloc).toBeDefined()
    expect(cashAlloc).toBeDefined()

    // Reference values: ~52% Equities, ~22% Bonds, ~16% ETFs, ~10% Cash
    expect(equityAlloc!.percentage).toBeCloseTo(52, 0)
    expect(bondAlloc!.percentage).toBeCloseTo(22, 0)
    expect(etfAlloc!.percentage).toBeCloseTo(16, 0)
    expect(cashAlloc!.percentage).toBeCloseTo(10, 0)

    // Total percentage sums to 100%
    const totalPercentage = breakdown.reduce((acc, curr) => acc + curr.percentage, 0)
    expect(totalPercentage).toBeCloseTo(100, 1)
  })
})
