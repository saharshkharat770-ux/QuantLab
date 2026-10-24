export interface StressPreset {
  id: string
  name: string
  description: string
  historicalReference?: string
  marketShockPercent: number
  interestRateShockBps: number
  volatilityShockPercent: number
  sectorShocks: Record<string, number>
}

export interface ScenarioResult {
  baselineValue: number
  stressedValue: number
  projectedPnL: number
  projectedPnLPercent: number
  assetImpacts: Array<{
    symbol: string
    assetClass: string
    currentValue: number
    stressedValue: number
    dollarImpact: number
    percentImpact: number
  }>
  allocationBefore: Array<{ category: string; weight: number }>
  allocationAfter: Array<{ category: string; weight: number }>
}

export interface MonteCarloPath {
  pathIndex: number
  values: number[]
}

export interface MonteCarloSimulationResult {
  initialValue: number
  horizonDays: number
  numPaths: number
  medianTerminalValue: number
  meanTerminalValue: number
  percentile5: number
  percentile25: number
  percentile75: number
  percentile95: number
  probabilityOfLossPercent: number
  representativePaths: Array<{
    day: number
    p5: number
    p25: number
    p50: number
    p75: number
    p95: number
  }>
}
