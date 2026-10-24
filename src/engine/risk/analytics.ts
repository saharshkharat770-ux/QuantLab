import { RiskMetrics, DrawdownPoint } from '../../types/risk'
import {
  calculateSimpleReturns,
  sampleStandardDeviation,
  mean,
  covariance,
  sampleVariance,
  pearsonCorrelation,
} from '../statistics/returns'

export function calculateAnnualizedVolatility(dailyReturns: number[]): number {
  if (dailyReturns.length < 2) return 0
  const dailyStd = sampleStandardDeviation(dailyReturns)
  return dailyStd * Math.sqrt(252) * 100
}

export function calculateHistoricalVaR(
  dailyReturns: number[],
  portfolioValue: number,
  confidenceLevel: 0.95 | 0.99
): number {
  if (dailyReturns.length === 0) return 0
  const sorted = [...dailyReturns].sort((a, b) => a - b)
  const alpha = 1 - confidenceLevel
  const index = Math.floor(alpha * sorted.length)
  const quantileReturn = sorted[Math.max(0, Math.min(index, sorted.length - 1))]

  // VaR is expressed as a positive loss dollar amount (or negative change)
  const dollarLoss = Math.abs(quantileReturn * portfolioValue)
  return -Math.round(dollarLoss)
}

export function calculateExpectedShortfall(
  dailyReturns: number[],
  portfolioValue: number,
  confidenceLevel: 0.95 | 0.99
): number {
  if (dailyReturns.length === 0) return 0
  const sorted = [...dailyReturns].sort((a, b) => a - b)
  const alpha = 1 - confidenceLevel
  const cutoffIndex = Math.max(1, Math.floor(alpha * sorted.length))
  const tailReturns = sorted.slice(0, cutoffIndex)
  const avgTailReturn = mean(tailReturns)

  const dollarLoss = Math.abs(avgTailReturn * portfolioValue)
  return -Math.round(dollarLoss)
}

export function calculateDrawdowns(prices: number[]): {
  maxDrawdownPercent: number
  drawdownSeries: number[]
  peakIndex: number
  troughIndex: number
} {
  if (prices.length === 0) {
    return { maxDrawdownPercent: 0, drawdownSeries: [], peakIndex: 0, troughIndex: 0 }
  }

  let peak = prices[0]
  let maxDD = 0
  let peakIndex = 0
  let troughIndex = 0
  let currentPeakIndex = 0
  const drawdownSeries: number[] = []

  for (let i = 0; i < prices.length; i++) {
    const p = prices[i]
    if (p > peak) {
      peak = p
      currentPeakIndex = i
    }
    const dd = peak > 0 ? (p - peak) / peak : 0
    drawdownSeries.push(dd * 100)

    if (dd < maxDD) {
      maxDD = dd
      peakIndex = currentPeakIndex
      troughIndex = i
    }
  }

  return {
    maxDrawdownPercent: Math.abs(maxDD * 100),
    drawdownSeries,
    peakIndex,
    troughIndex,
  }
}

export function calculateBetaAndCorrelation(
  portfolioReturns: number[],
  benchmarkReturns: number[]
): { beta: number; correlation: number } {
  const n = Math.min(portfolioReturns.length, benchmarkReturns.length)
  if (n < 2) return { beta: 1.0, correlation: 1.0 }

  const pSlice = portfolioReturns.slice(0, n)
  const bSlice = benchmarkReturns.slice(0, n)

  const bVar = sampleVariance(bSlice)
  if (bVar === 0) return { beta: 1.0, correlation: 1.0 }

  const cov = covariance(pSlice, bSlice)
  const beta = cov / bVar
  const correlation = pearsonCorrelation(pSlice, bSlice)

  return {
    beta: Number(beta.toFixed(2)),
    correlation: Number(correlation.toFixed(2)),
  }
}

export function calculateSharpeRatio(
  annualizedReturnPercent: number,
  annualizedVolPercent: number,
  riskFreeRatePercent: number = 4.5
): number {
  if (annualizedVolPercent <= 0) return 0
  const excess = (annualizedReturnPercent - riskFreeRatePercent) / annualizedVolPercent
  return Number(excess.toFixed(2))
}

export function calculateSortinoRatio(
  dailyReturns: number[],
  annualizedReturnPercent: number,
  riskFreeRatePercent: number = 4.5
): number {
  const negativeReturns = dailyReturns.filter((r) => r < 0)
  if (negativeReturns.length < 2) return 0

  const downsideVariance =
    negativeReturns.reduce((sum, r) => sum + r * r, 0) / negativeReturns.length
  const downsideDeviation = Math.sqrt(downsideVariance) * Math.sqrt(252) * 100

  if (downsideDeviation <= 0) return 0
  const sortino = (annualizedReturnPercent - riskFreeRatePercent) / downsideDeviation
  return Number(sortino.toFixed(2))
}

export function calculateCompositeRiskScore(
  volatilityPercent: number,
  maxDrawdownPercent: number,
  beta: number
): { score: number; category: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' } {
  // Institutional composite risk gauge calibrated to baseline:
  // Volatility (14.82% -> 27 pts), Max Drawdown (8.4% -> 19 pts), Beta (0.92 -> 16 pts) = 62 / 100
  const volScore = Math.min(45, (volatilityPercent / 14.82) * 27)
  const ddScore = Math.min(35, (maxDrawdownPercent / 8.4) * 19)
  const betaScore = Math.min(20, (beta / 0.92) * 16)

  const rawScore = Math.round(volScore + ddScore + betaScore)
  const score = Math.max(1, Math.min(99, rawScore))

  let category: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' = 'MEDIUM RISK'
  if (score < 40) category = 'LOW RISK'
  else if (score > 70) category = 'HIGH RISK'

  return { score, category }
}
