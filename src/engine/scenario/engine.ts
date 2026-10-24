import { Holding } from '../../types/portfolio'
import { StressPreset, ScenarioResult, MonteCarloSimulationResult } from '../../types/scenario'

export const STRESS_PRESETS: StressPreset[] = [
  {
    id: 'global-financial-crisis',
    name: '2008 Financial Crisis',
    description: 'Severe liquidity crunch and broad equities collapse (-38%), credit spread blowout.',
    historicalReference: 'Sept 2008 - March 2009',
    marketShockPercent: -38,
    interestRateShockBps: -250,
    volatilityShockPercent: +140,
    sectorShocks: {
      Financials: -55,
      Technology: -35,
      ConsumerDiscretionary: -40,
      Healthcare: -18,
      Utilities: -12,
    },
  },
  {
    id: 'tech-bubble-deflation',
    name: 'Tech Bubble & Growth Selloff',
    description: 'High-multiple technology correction (-32%), flight to defensive value and cash.',
    historicalReference: 'March 2000 / 2022 Tech drawdown',
    marketShockPercent: -22,
    interestRateShockBps: +150,
    volatilityShockPercent: +85,
    sectorShocks: {
      Technology: -38,
      CommunicationServices: -30,
      ConsumerDiscretionary: -25,
      Energy: +12,
      Healthcare: -6,
    },
  },
  {
    id: 'rapid-rate-hikes',
    name: 'Aggressive Rate Hike Cycle (+300 bps)',
    description: 'Sharp central bank tightening hurting duration bonds (-18%) and rate-sensitive equities.',
    historicalReference: '2022-2023 Central Bank Tightening',
    marketShockPercent: -15,
    interestRateShockBps: +300,
    volatilityShockPercent: +45,
    sectorShocks: {
      RealEstate: -28,
      Utilities: -19,
      Technology: -20,
      Financials: +8,
      Energy: +14,
    },
  },
  {
    id: 'stagflation-energy-shock',
    name: 'Stagflation & Energy Shock',
    description: 'Supply disruption causing commodity spikes, consumer drag, and compressed corporate margins.',
    historicalReference: '1973 Oil Shock / 2022 Energy Spike',
    marketShockPercent: -18,
    interestRateShockBps: +200,
    volatilityShockPercent: +60,
    sectorShocks: {
      Energy: +35,
      Commodities: +28,
      ConsumerDiscretionary: -24,
      Transportation: -22,
      Technology: -16,
    },
  },
]

export function applyStressScenario(
  holdings: Holding[],
  cashBalance: number,
  marketShockPercent: number,
  sectorShocks: Record<string, number> = {}
): ScenarioResult {
  let baselineTotal = cashBalance
  let stressedTotal = cashBalance

  const assetImpacts = holdings.map((h) => {
    const curVal = h.quantity * h.currentPrice
    baselineTotal += curVal

    let shock = marketShockPercent

    // Asset class specific adjustment
    if (h.assetClass === 'Bonds') {
      shock = marketShockPercent * 0.35 // Bonds typically experience dampened equity shock
    } else if (h.assetClass === 'Cash') {
      shock = 0
    }

    // Sector override if defined
    if (h.sector && sectorShocks[h.sector] !== undefined) {
      shock = sectorShocks[h.sector]
    }

    const stressedVal = Math.max(0, curVal * (1 + shock / 100))
    stressedTotal += stressedVal

    return {
      symbol: h.symbol,
      assetClass: h.assetClass,
      currentValue: Number(curVal.toFixed(2)),
      stressedValue: Number(stressedVal.toFixed(2)),
      dollarImpact: Number((stressedVal - curVal).toFixed(2)),
      percentImpact: Number(shock.toFixed(2)),
    }
  })

  const pnl = stressedTotal - baselineTotal
  const pnlPercent = baselineTotal > 0 ? (pnl / baselineTotal) * 100 : 0

  // Allocations before and after
  const catBefore: Record<string, number> = { Cash: cashBalance }
  const catAfter: Record<string, number> = { Cash: cashBalance }

  for (const item of assetImpacts) {
    catBefore[item.assetClass] = (catBefore[item.assetClass] || 0) + item.currentValue
    catAfter[item.assetClass] = (catAfter[item.assetClass] || 0) + item.stressedValue
  }

  const allocationBefore = Object.entries(catBefore).map(([category, val]) => ({
    category,
    weight: Number(((val / baselineTotal) * 100).toFixed(1)),
  }))

  const allocationAfter = Object.entries(catAfter).map(([category, val]) => ({
    category,
    weight: Number(((val / stressedTotal) * 100).toFixed(1)),
  }))

  return {
    baselineValue: Number(baselineTotal.toFixed(2)),
    stressedValue: Number(stressedTotal.toFixed(2)),
    projectedPnL: Number(pnl.toFixed(2)),
    projectedPnLPercent: Number(pnlPercent.toFixed(2)),
    assetImpacts,
    allocationBefore,
    allocationAfter,
  }
}

// Deterministic Pseudo-Random Number Generator (Linear Congruential Generator)
class SeededRNG {
  private state: number
  constructor(seed: number = 123456789) {
    this.state = seed
  }

  // Generates uniform [0, 1)
  next(): number {
    this.state = (1103515245 * this.state + 12345) % 2147483648
    return this.state / 2147483648
  }

  // Standard Normal Variate via Box-Muller transform
  nextNormal(): number {
    const u1 = Math.max(1e-15, this.next())
    const u2 = this.next()
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  }
}

export function runMonteCarloSimulation(
  initialValue: number,
  annualizedDriftPercent: number = 8.5,
  annualizedVolPercent: number = 14.82,
  horizonDays: number = 252,
  numPaths: number = 500,
  seed: number = 42
): MonteCarloSimulationResult {
  const rng = new SeededRNG(seed)
  const dt = 1 / 252
  const mu = annualizedDriftPercent / 100
  const sigma = annualizedVolPercent / 100

  // Pre-calculate drift term
  const drift = (mu - 0.5 * sigma * sigma) * dt
  const volTerm = sigma * Math.sqrt(dt)

  const terminalValues: number[] = []
  const stepInterval = Math.max(1, Math.floor(horizonDays / 25))
  const sampleDays: number[] = []
  for (let d = 0; d <= horizonDays; d += stepInterval) {
    sampleDays.push(d)
  }
  if (sampleDays[sampleDays.length - 1] !== horizonDays) {
    sampleDays.push(horizonDays)
  }

  // Matrix of path values at sampleDays
  const sampledPathValues: number[][] = Array.from({ length: sampleDays.length }, () => [])

  for (let p = 0; p < numPaths; p++) {
    let currentVal = initialValue
    let dayIndex = 0

    if (sampleDays[dayIndex] === 0) {
      sampledPathValues[dayIndex].push(currentVal)
      dayIndex++
    }

    for (let day = 1; day <= horizonDays; day++) {
      const z = rng.nextNormal()
      currentVal *= Math.exp(drift + volTerm * z)

      if (day === sampleDays[dayIndex]) {
        sampledPathValues[dayIndex].push(currentVal)
        dayIndex++
      }
    }
    terminalValues.push(currentVal)
  }

  terminalValues.sort((a, b) => a - b)
  const lossCount = terminalValues.filter((v) => v < initialValue).length
  const probLoss = (lossCount / numPaths) * 100

  const p5 = terminalValues[Math.floor(0.05 * numPaths)]
  const p25 = terminalValues[Math.floor(0.25 * numPaths)]
  const p50 = terminalValues[Math.floor(0.5 * numPaths)]
  const p75 = terminalValues[Math.floor(0.75 * numPaths)]
  const p95 = terminalValues[Math.floor(0.95 * numPaths)]
  const meanVal = terminalValues.reduce((s, v) => s + v, 0) / numPaths

  // Generate fan curve percentiles over time
  const representativePaths = sampleDays.map((day, sIdx) => {
    const vals = [...sampledPathValues[sIdx]].sort((a, b) => a - b)
    const n = vals.length
    return {
      day,
      p5: Math.round(vals[Math.floor(0.05 * n)] || initialValue),
      p25: Math.round(vals[Math.floor(0.25 * n)] || initialValue),
      p50: Math.round(vals[Math.floor(0.5 * n)] || initialValue),
      p75: Math.round(vals[Math.floor(0.75 * n)] || initialValue),
      p95: Math.round(vals[Math.floor(0.95 * n)] || initialValue),
    }
  })

  return {
    initialValue,
    horizonDays,
    numPaths,
    medianTerminalValue: Math.round(p50),
    meanTerminalValue: Math.round(meanVal),
    percentile5: Math.round(p5),
    percentile25: Math.round(p25),
    percentile75: Math.round(p75),
    percentile95: Math.round(p95),
    probabilityOfLossPercent: Number(probLoss.toFixed(1)),
    representativePaths,
  }
}
