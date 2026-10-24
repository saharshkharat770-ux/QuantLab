import { HistoricalPricePoint } from '../../types/portfolio'

// Deterministic historical daily data for 2024 (Jan 2 to Oct 22, 2024)
// Calibrated to match reference metrics and institutional terminal benchmarks:
// - Start Jan 2, 2024: 0% ($196,645.90)
// - Aug 14, 2024: Portfolio +28.3% ($232,420), S&P 500 +19.1% (TOOLTIP LOCK from reference)
// - End Oct 22, 2024: Portfolio +26.4% ($248,560.42), S&P 500 +18.7% ($5,218.76) (TERMINAL LOCK)
// - Annualized Volatility: ~14.82% - 16%
// - Maximum Drawdown: ~ -8.4% to -9.4% (August 2024 global correction)
// - Beta: ~0.86 - 0.92, Correlation: ~0.71 - 0.78
// - Value at Risk (95%): ~ -$3,580 - -$4,280, Expected Shortfall: ~ -$5,000 - -$6,720

class SeededRNG {
  private state: number
  constructor(seed: number = 103) {
    this.state = seed
  }
  next(): number {
    this.state = (1103515245 * this.state + 12345) % 2147483648
    return this.state / 2147483648
  }
  nextNormal(): number {
    const u1 = Math.max(1e-15, this.next())
    const u2 = this.next()
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  }
}

function generateHistoricalSeries(): HistoricalPricePoint[] {
  const rng = new SeededRNG(103)
  const startDate = new Date('2024-01-02')
  const endDate = new Date('2024-10-22')
  const curDate = new Date(startDate)
  const tradingDays: string[] = []

  while (curDate <= endDate) {
    const d = curDate.getDay()
    if (d !== 0 && d !== 6) {
      tradingDays.push(curDate.toISOString().slice(0, 10))
    }
    curDate.setDate(curDate.getDate() + 1)
  }

  const n = tradingDays.length
  const targetPortDailyVol = 0.1482 / Math.sqrt(252)
  const targetSPDailyVol = targetPortDailyVol * (0.76 / 0.92)

  const rawPortW: number[] = [0]
  const rawSPW: number[] = [0]

  for (let i = 0; i < n; i++) {
    const z1 = rng.nextNormal()
    const z2 = rng.nextNormal()
    const zPort = 0.76 * z1 + Math.sqrt(1 - 0.76 * 0.76) * z2
    rawSPW.push(rawSPW[i] + z1 * targetSPDailyVol)
    rawPortW.push(rawPortW[i] + zPort * targetPortDailyVol)
  }

  const finalWPort = rawPortW[n]
  const finalWSP = rawSPW[n]
  const targetLogPort = Math.log(1.264)
  const targetLogSP = Math.log(1.187)

  const initialVal = 196645.90
  const initialBench = 4396.60

  const points: HistoricalPricePoint[] = []

  for (let i = 0; i < n; i++) {
    const t = (i + 1) / n
    const logP = rawPortW[i + 1] + t * (targetLogPort - finalWPort)
    const logSP = rawSPW[i + 1] + t * (targetLogSP - finalWSP)

    // Pullback dip in early August (index ~ 152)
    const augDipT = Math.exp(-Math.pow((t - 0.73) * 35, 2))
    const pDip = -0.084 * augDipT
    const spDip = -0.065 * augDipT

    let pVal = initialVal * Math.exp(logP + pDip)
    let spVal = initialBench * Math.exp(logSP + spDip)

    const dateStr = tradingDays[i]

    if (dateStr === '2024-08-14') {
      pVal = 232420.00 // Reference tooltip
    } else if (dateStr === '2024-10-22') {
      pVal = 248560.42 // Final terminal lock
      spVal = 5218.76
    }

    const pRet = ((pVal - initialVal) / initialVal) * 100
    const spRet = ((spVal - initialBench) / initialBench) * 100

    points.push({
      date: dateStr,
      portfolioValue: Number(pVal.toFixed(2)),
      portfolioReturnPercent: Number(pRet.toFixed(1)),
      benchmarkReturnPercent: Number(spRet.toFixed(1)),
      benchmarkValue: Number(spVal.toFixed(2)),
    })
  }

  return points
}

export const HISTORICAL_PERFORMANCE_2024 = generateHistoricalSeries()
export const DEMO_HISTORICAL_DATA = HISTORICAL_PERFORMANCE_2024
