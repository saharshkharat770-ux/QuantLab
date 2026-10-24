import { describe, it, expect } from 'vitest'
import {
  calculateSimpleReturns,
  calculateLogReturns,
  calculateMean,
  calculateVariance,
  calculateStandardDeviation,
  calculateCovariance,
  calculatePearsonCorrelation,
} from '../../engine/statistics/returns'

describe('Statistical Return Calculations', () => {
  it('calculates simple returns accurately', () => {
    const prices = [100, 110, 104.5, 115]
    const returns = calculateSimpleReturns(prices)

    expect(returns.length).toBe(3)
    expect(returns[0]).toBeCloseTo(0.10, 4) // 10%
    expect(returns[1]).toBeCloseTo(-0.05, 4) // -5%
    expect(returns[2]).toBeCloseTo(0.100478, 4) // ~10.05%
  })

  it('calculates log returns accurately', () => {
    const prices = [100, 105, 102]
    const logReturns = calculateLogReturns(prices)

    expect(logReturns.length).toBe(2)
    expect(logReturns[0]).toBeCloseTo(Math.log(105 / 100), 5)
    expect(logReturns[1]).toBeCloseTo(Math.log(102 / 105), 5)
  })

  it('calculates mean, sample variance and standard deviation', () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9]
    // Mean = 40 / 8 = 5.0
    const mean = calculateMean(data)
    expect(mean).toBe(5)

    // Sample variance = sum((x - mean)^2) / (n - 1) = 32 / 7 ≈ 4.5714
    const variance = calculateVariance(data, true)
    expect(variance).toBeCloseTo(4.5714, 3)

    // Sample std dev = sqrt(4.5714) ≈ 2.138
    const stdDev = calculateStandardDeviation(data, true)
    expect(stdDev).toBeCloseTo(2.138, 3)
  })

  it('calculates covariance and Pearson correlation', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [2, 4, 6, 8, 10] // Perfect positive correlation

    const cov = calculateCovariance(x, y)
    const corr = calculatePearsonCorrelation(x, y)

    expect(cov).toBeGreaterThan(0)
    expect(corr).toBeCloseTo(1.0, 5)

    const z = [10, 8, 6, 4, 2] // Perfect negative correlation
    const corrNeg = calculatePearsonCorrelation(x, z)
    expect(corrNeg).toBeCloseTo(-1.0, 5)
  })
})
