import { describe, it, expect } from 'vitest'
import {
  STRESS_PRESETS,
  applyStressScenario,
  runMonteCarloSimulation,
} from '../../engine/scenario/engine'
import { INITIAL_HOLDINGS, INITIAL_CASH_BALANCE } from '../../data/demo/portfolio'

describe('Scenario Studio & Monte Carlo Engine', () => {
  it('loads valid pre-configured historical stress presets', () => {
    expect(STRESS_PRESETS.length).toBeGreaterThanOrEqual(4)
    const gfc = STRESS_PRESETS.find((p) => p.id === 'global-financial-crisis')
    expect(gfc).toBeDefined()
    expect(gfc?.marketShockPercent).toBe(-38)
    expect(gfc?.sectorShocks?.Financials).toBe(-55)
  })

  it('calculates stress impact on holdings and cash preserving liquidity', () => {
    const preset = STRESS_PRESETS[0] // 2008 GFC
    const impact = applyStressScenario(
      INITIAL_HOLDINGS,
      INITIAL_CASH_BALANCE,
      preset.marketShockPercent,
      preset.sectorShocks
    )

    // Baseline value should equal total portfolio (~$248,560)
    expect(impact.baselineValue).toBeCloseTo(248560.42, 0)
    // Under 2008 GFC, stressed value should decline
    expect(impact.stressedValue).toBeLessThan(impact.baselineValue)
    expect(impact.projectedPnL).toBeLessThan(0)
    expect(impact.projectedPnLPercent).toBeLessThan(0)

    // Allocation before and after should sum to ~100%
    const totalWeightBefore = impact.allocationBefore.reduce((acc, c) => acc + c.weight, 0)
    const totalWeightAfter = impact.allocationAfter.reduce((acc, c) => acc + c.weight, 0)
    expect(totalWeightBefore).toBeCloseTo(100, 0)
    expect(totalWeightAfter).toBeCloseTo(100, 0)
  })

  it('runs deterministic Monte Carlo simulation with Geometric Brownian Motion', () => {
    const initial = 248560
    const sim1 = runMonteCarloSimulation(initial, 8.5, 14.82, 252, 200, 42)
    const sim2 = runMonteCarloSimulation(initial, 8.5, 14.82, 252, 200, 42)

    // Same seed -> exact byte-for-byte deterministic results
    expect(sim1.medianTerminalValue).toBe(sim2.medianTerminalValue)
    expect(sim1.percentile95).toBe(sim2.percentile95)
    expect(sim1.percentile5).toBe(sim2.percentile5)

    // Distribution properties: 95th percentile > 50th percentile > 5th percentile
    expect(sim1.percentile95).toBeGreaterThan(sim1.medianTerminalValue)
    expect(sim1.medianTerminalValue).toBeGreaterThan(sim1.percentile5)

    // Representative fan paths
    expect(sim1.representativePaths.length).toBeGreaterThan(0)
  })
})
