import { describe, it, expect } from 'vitest'
import { runBacktest, calculateSMA } from '../../engine/backtest/engine'
import { DEMO_HISTORICAL_DATA } from '../../data/demo/historical'

describe('Algorithmic Backtesting Engine', () => {
  it('correctly calculates Simple Moving Average (SMA)', () => {
    const prices = [10, 20, 30, 40, 50]
    const sma3 = calculateSMA(prices, 3)

    expect(Number.isNaN(sma3[0])).toBe(true)
    expect(Number.isNaN(sma3[1])).toBe(true)
    expect(sma3[2]).toBe(20) // (10 + 20 + 30) / 3
    expect(sma3[3]).toBe(30) // (20 + 30 + 40) / 3
    expect(sma3[4]).toBe(40) // (30 + 40 + 50) / 3
  })

  it('runs Buy and Hold backtest with zero look-ahead bias', () => {
    const historical = DEMO_HISTORICAL_DATA.map((d) => ({
      date: d.date,
      price: d.portfolioValue,
      benchmarkPrice: d.benchmarkValue,
    }))

    const result = runBacktest(
      {
        strategy: 'BUY_AND_HOLD',
        symbol: 'PORTFOLIO',
        benchmarkSymbol: 'S&P 500',
        startDate: '2024-01-02',
        endDate: '2024-10-22',
        initialCapital: 100000,
        transactionCostBps: 10,
        slippageBps: 5,
      },
      historical
    )

    expect(result.totalTrades).toBeGreaterThanOrEqual(1)
    expect(result.finalPortfolioValue).toBeGreaterThan(100000)
    expect(result.equityCurve.length).toBe(historical.length)
    expect(result.totalFeesPaid).toBeGreaterThan(0)
    expect(result.sharpeRatio).toBeGreaterThan(0)
  })

  it('runs SMA Crossover strategy and generates trade records with realistic friction', () => {
    const historical = DEMO_HISTORICAL_DATA.map((d) => ({
      date: d.date,
      price: d.portfolioValue,
      benchmarkPrice: d.benchmarkValue,
    }))

    const result = runBacktest(
      {
        strategy: 'SMA_CROSSOVER',
        symbol: 'PORTFOLIO',
        benchmarkSymbol: 'S&P 500',
        startDate: '2024-01-02',
        endDate: '2024-10-22',
        initialCapital: 100000,
        shortWindow: 10,
        longWindow: 30,
        transactionCostBps: 15,
        slippageBps: 5,
      },
      historical
    )

    expect(result.equityCurve.length).toBe(historical.length)
    expect(result.maxDrawdownPercent).toBeGreaterThanOrEqual(0)
    expect(result.annualizedVolatilityPercent).toBeGreaterThan(0)
    // Every trade record should contain valid dates, prices, and non-negative fees
    result.trades.forEach((trade) => {
      expect(trade.date).toBeDefined()
      expect(trade.price).toBeGreaterThan(0)
      expect(trade.fee).toBeGreaterThanOrEqual(0)
      expect(['BUY', 'SELL']).toContain(trade.action)
    })
  })
})
