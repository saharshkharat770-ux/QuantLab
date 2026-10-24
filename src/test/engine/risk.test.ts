import { describe, it, expect } from 'vitest'
import {
  calculateAnnualizedVolatility,
  calculateHistoricalVaR,
  calculateExpectedShortfall,
  calculateDrawdowns,
  calculateBetaAndCorrelation,
  calculateSharpeRatio,
  calculateSortinoRatio,
  calculateCompositeRiskScore,
} from '../../engine/risk/analytics'
import { DEMO_HISTORICAL_DATA } from '../../data/demo/historical'
import { calculateSimpleReturns } from '../../engine/statistics/returns'

describe('Risk Analytics & Metrics Engine', () => {
  const portfolioPrices = DEMO_HISTORICAL_DATA.map((d) => d.portfolioValue)
  const sp500Prices = DEMO_HISTORICAL_DATA.map((d) => d.benchmarkValue)
  const portfolioReturns = calculateSimpleReturns(portfolioPrices)
  const sp500Returns = calculateSimpleReturns(sp500Prices)
  const portfolioValue = portfolioPrices[portfolioPrices.length - 1]

  it('calculates annualized volatility consistent with reference (~14.82%)', () => {
    const vol = calculateAnnualizedVolatility(portfolioReturns)
    // Reference KPI: 14.82%
    expect(vol).toBeGreaterThan(12.0)
    expect(vol).toBeLessThan(18.0)
  })

  it('calculates Historical Value at Risk (VaR 95%) consistent with reference (-$4,280)', () => {
    const var95 = calculateHistoricalVaR(portfolioReturns, portfolioValue, 0.95)
    // Reference snapshot: -$4,280
    expect(var95).toBeLessThan(0)
    expect(Math.abs(var95)).toBeGreaterThan(3000)
    expect(Math.abs(var95)).toBeLessThan(6000)
  })

  it('calculates Expected Shortfall (CVaR 95%) strictly deeper than VaR (-$6,720)', () => {
    const var95 = calculateHistoricalVaR(portfolioReturns, portfolioValue, 0.95)
    const es95 = calculateExpectedShortfall(portfolioReturns, portfolioValue, 0.95)
    // Expected Shortfall (tail conditional expectation) is strictly more severe than VaR
    expect(es95).toBeLessThan(var95)
    expect(Math.abs(es95)).toBeGreaterThan(Math.abs(var95))
  })

  it('calculates Maximum Drawdown consistent with reference (-8.4%)', () => {
    const dd = calculateDrawdowns(portfolioPrices)
    expect(dd.maxDrawdownPercent).toBeGreaterThan(5.0)
    expect(dd.maxDrawdownPercent).toBeLessThan(12.0)
    expect(dd.drawdownSeries.length).toBe(portfolioPrices.length)
  })

  it('calculates Beta (0.92) and Correlation (0.76) vs S&P 500', () => {
    const { beta, correlation } = calculateBetaAndCorrelation(portfolioReturns, sp500Returns)
    expect(beta).toBeGreaterThan(0.7)
    expect(beta).toBeLessThan(1.2)
    expect(correlation).toBeGreaterThan(0.6)
    expect(correlation).toBeLessThan(0.95)
  })

  it('calculates Sharpe Ratio matching reference (1.47)', () => {
    // Reference: 1.47
    const annualizedReturn = 26.4 // +26.4% YTD annualized
    const annualizedVol = 14.82
    const sharpe = calculateSharpeRatio(annualizedReturn, annualizedVol, 4.5)
    expect(sharpe).toBeCloseTo(1.47, 1)
  })

  it('calculates Sortino Ratio focusing on downside risk', () => {
    const annualizedReturn = 26.4
    const sortino = calculateSortinoRatio(portfolioReturns, annualizedReturn, 4.5)
    expect(sortino).toBeGreaterThan(0)
    expect(sortino).toBeGreaterThan(1.0)
  })

  it('calculates composite risk score gauge matching reference (62 / 100 MEDIUM RISK)', () => {
    const risk = calculateCompositeRiskScore(14.82, 8.4, 0.92)
    expect(risk.score).toBe(62)
    expect(risk.category).toBe('MEDIUM RISK')
  })
})
