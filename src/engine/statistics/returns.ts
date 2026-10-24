export function calculateSimpleReturns(prices: number[]): number[] {
  if (prices.length < 2) return []
  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1]
    if (prev <= 0) {
      returns.push(0)
    } else {
      returns.push((prices[i] - prev) / prev)
    }
  }
  return returns
}

export function calculateLogReturns(prices: number[]): number[] {
  if (prices.length < 2) return []
  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1]
    if (prev <= 0 || prices[i] <= 0) {
      returns.push(0)
    } else {
      returns.push(Math.log(prices[i] / prev))
    }
  }
  return returns
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0
  const sum = values.reduce((acc, v) => acc + v, 0)
  return sum / values.length
}

export function sampleVariance(values: number[]): number {
  if (values.length < 2) return 0
  const avg = mean(values)
  const sumSq = values.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0)
  return sumSq / (values.length - 1)
}

export function sampleStandardDeviation(values: number[]): number {
  return Math.sqrt(sampleVariance(values))
}

export function covariance(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length)
  if (n < 2) return 0
  const meanX = mean(x.slice(0, n))
  const meanY = mean(y.slice(0, n))

  let cov = 0
  for (let i = 0; i < n; i++) {
    cov += (x[i] - meanX) * (y[i] - meanY)
  }
  return cov / (n - 1)
}

export function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length)
  if (n < 2) return 0

  const stdX = sampleStandardDeviation(x.slice(0, n))
  const stdY = sampleStandardDeviation(y.slice(0, n))

  if (stdX === 0 || stdY === 0) return 0
  const cov = covariance(x, y)
  const corr = cov / (stdX * stdY)
  return Math.max(-1, Math.min(1, corr))
}

export function alignSeriesByDate<T extends { date: string }>(
  seriesA: T[],
  seriesB: T[]
): { alignedA: T[]; alignedB: T[] } {
  const mapB = new Map(seriesB.map((item) => [item.date, item]))
  const alignedA: T[] = []
  const alignedB: T[] = []

  for (const itemA of seriesA) {
    const itemB = mapB.get(itemA.date)
    if (itemB) {
      alignedA.push(itemA)
      alignedB.push(itemB)
    }
  }

  return { alignedA, alignedB }
}

// Aliases for intuitive mathematical naming
export const calculateMean = mean
export const calculateVariance = (values: number[], _isSample?: boolean) => sampleVariance(values)
export const calculateStandardDeviation = (values: number[], _isSample?: boolean) => sampleStandardDeviation(values)
export const calculateCovariance = covariance
export const calculatePearsonCorrelation = pearsonCorrelation
