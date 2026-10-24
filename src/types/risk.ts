export interface RiskMetrics {
  riskScore: number // 0-100 scale (e.g. 62)
  riskCategory: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK'
  valueAtRisk95: number // e.g. -4280
  valueAtRisk99: number
  expectedShortfall95: number // CVaR e.g. -6720
  expectedShortfall99: number
  maxDrawdownPercent: number // e.g. -8.4
  maxDrawdownPeakDate?: string
  maxDrawdownTroughDate?: string
  recoveryDate?: string
  betaVsBenchmark: number // e.g. 0.92
  correlationVsBenchmark: number // e.g. 0.76
  annualizedVolatilityPercent: number // e.g. 14.82
  sharpeRatio: number // e.g. 1.47
  sortinoRatio: number
}

export interface DrawdownPoint {
  date: string
  portfolioDrawdown: number
  benchmarkDrawdown: number
}

export interface ReturnDistributionBucket {
  range: string
  min: number
  max: number
  count: number
  percentage: number
}

export interface CorrelationCell {
  assetA: string
  assetB: string
  correlation: number
}
