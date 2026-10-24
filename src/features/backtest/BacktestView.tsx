import React, { useState, useMemo } from 'react'
import {
  LineChart,
  Play,
  RotateCcw,
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { BacktestConfig, StrategyType } from '../../types/backtest'
import { HISTORICAL_PERFORMANCE_2024 } from '../../data/demo/historical'
import { runBacktest } from '../../engine/backtest/engine'
import { useApp } from '../../context/AppContext'

export const BacktestView: React.FC = () => {
  const { benchmark, formatCurrency, addNotification } = useApp()

  const [strategy, setStrategy] = useState<StrategyType>('SMA_CROSSOVER')
  const [symbol, setSymbol] = useState<string>('NVDA')
  const [initialCapital, setInitialCapital] = useState<number>(100000)
  const [shortWindow, setShortWindow] = useState<number>(15)
  const [longWindow, setLongWindow] = useState<number>(45)
  const [txFeeBps, setTxFeeBps] = useState<number>(10)
  const [slippageBps, setSlippageBps] = useState<number>(5)

  // Simulation execution trigger
  const [runCount, setRunCount] = useState<number>(1)

  // Prepare input series from historical data
  const historicalData = useMemo(() => {
    // Generate simulated single-asset price series correlated with benchmark
    let basePrice = symbol === 'NVDA' ? 48.0 : symbol === 'AAPL' ? 185.0 : 475.0
    return HISTORICAL_PERFORMANCE_2024.map((pt, i) => {
      const mult = 1 + (pt.portfolioReturnPercent / 100) * (symbol === 'NVDA' ? 1.8 : 1.1)
      const p = basePrice * mult
      return {
        date: pt.date,
        price: Number(p.toFixed(2)),
        benchmarkPrice: pt.benchmarkValue,
      }
    })
  }, [symbol])

  // Run backtest calculation
  const backtestResult = useMemo(() => {
    const config: BacktestConfig = {
      strategy,
      symbol,
      benchmarkSymbol: benchmark,
      startDate: historicalData[0]?.date || '2024-01-02',
      endDate: historicalData[historicalData.length - 1]?.date || '2024-10-22',
      initialCapital,
      shortWindow,
      longWindow,
      transactionCostBps: txFeeBps,
      slippageBps: slippageBps,
    }
    return runBacktest(config, historicalData)
  }, [strategy, symbol, benchmark, initialCapital, shortWindow, longWindow, txFeeBps, slippageBps, historicalData, runCount])

  const handleRun = () => {
    setRunCount((prev) => prev + 1)
    addNotification('Backtest Simulation Complete', `Ran ${strategy} backtest on ${symbol} with 0 look-ahead bias.`, 'success')
  }

  const handleReset = () => {
    setStrategy('SMA_CROSSOVER')
    setSymbol('NVDA')
    setInitialCapital(100000)
    setShortWindow(15)
    setLongWindow(45)
    setTxFeeBps(10)
    setSlippageBps(5)
    addNotification('Parameters Reset', 'Restored default quantitative strategy parameters.', 'info')
  }

  const eqCurve = backtestResult.equityCurve
  const n = eqCurve.length

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-background-surface shadow-panel">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <LineChart className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-content-primary">Algorithmic Backtesting Lab</h1>
          </div>
          <p className="mt-1 text-xs text-content-muted">
            Test quantitative trading strategies chronologically without look-ahead bias, accounting for transaction fees and execution slippage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-background-elevated hover:border-brand-cyan text-content-secondary hover:text-content-primary text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-blue hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-glow transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Simulation</span>
          </button>
        </div>
      </div>

      {/* Strategy Parameters Configuration Bar */}
      <div className="p-5 rounded-xl border border-border/80 bg-background-surface shadow-panel space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-content-secondary uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-brand-blue" />
          <span>Strategy & Execution Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Strategy Type */}
          <div>
            <label className="text-content-muted font-medium block mb-1">Strategy Rule</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as StrategyType)}
              className="w-full px-3 py-2 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold focus:outline-none focus:border-brand-cyan"
            >
              <option value="SMA_CROSSOVER">SMA Crossover (Trend Following)</option>
              <option value="BUY_AND_HOLD">Buy & Hold (Baseline Benchmark)</option>
              <option value="PERIODIC_REBALANCE">Periodic Target Rebalancing</option>
            </select>
          </div>

          {/* Target Asset */}
          <div>
            <label className="text-content-muted font-medium block mb-1">Underlying Asset</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold focus:outline-none focus:border-brand-cyan"
            >
              <option value="NVDA">NVDA (NVIDIA Corporation)</option>
              <option value="AAPL">AAPL (Apple Inc.)</option>
              <option value="SPY">SPY (S&P 500 ETF)</option>
            </select>
          </div>

          {/* Fast & Slow Windows (for SMA) */}
          {strategy === 'SMA_CROSSOVER' ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-content-muted font-medium block mb-1">Fast SMA (Days)</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={shortWindow}
                  onChange={(e) => setShortWindow(parseInt(e.target.value) || 10)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold text-right"
                />
              </div>
              <div>
                <label className="text-content-muted font-medium block mb-1">Slow SMA (Days)</label>
                <input
                  type="number"
                  min="20"
                  max="120"
                  value={longWindow}
                  onChange={(e) => setLongWindow(parseInt(e.target.value) || 40)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold text-right"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-content-muted font-medium block mb-1">Initial Capital</label>
              <input
                type="number"
                step="5000"
                value={initialCapital}
                onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 10000)}
                className="w-full px-3 py-1.5 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold text-right"
              />
            </div>
          )}

          {/* Transaction Friction & Slippage */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-content-muted font-medium block mb-1">Fee (bps)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={txFeeBps}
                onChange={(e) => setTxFeeBps(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold text-right"
              />
            </div>
            <div>
              <label className="text-content-muted font-medium block mb-1">Slippage (bps)</label>
              <input
                type="number"
                min="0"
                max="30"
                value={slippageBps}
                onChange={(e) => setSlippageBps(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold text-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl border border-border bg-background-surface shadow-panel">
          <div className="text-[11px] text-content-muted font-medium">Cumulative Return</div>
          <div className={`text-lg font-bold mt-1 tabular-nums ${backtestResult.cumulativeReturnPercent >= 0 ? 'text-financial-positive' : 'text-financial-negative'}`}>
            {backtestResult.cumulativeReturnPercent >= 0 ? '+' : ''}{backtestResult.cumulativeReturnPercent}%
          </div>
          <div className="text-[10px] text-content-secondary mt-0.5">Benchmark: +{backtestResult.benchmarkReturnPercent}%</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background-surface shadow-panel">
          <div className="text-[11px] text-content-muted font-medium">Sharpe Ratio</div>
          <div className="text-lg font-bold text-content-primary mt-1 tabular-nums">
            {backtestResult.sharpeRatio}
          </div>
          <div className="text-[10px] text-content-secondary mt-0.5">Annualized Rf: 4.5%</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background-surface shadow-panel">
          <div className="text-[11px] text-content-muted font-medium">Max Drawdown</div>
          <div className="text-lg font-bold text-financial-negative mt-1 tabular-nums">
            -{backtestResult.maxDrawdownPercent}%
          </div>
          <div className="text-[10px] text-content-secondary mt-0.5">Deepest peak-to-trough</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background-surface shadow-panel">
          <div className="text-[11px] text-content-muted font-medium">Win Rate</div>
          <div className="text-lg font-bold text-brand-cyan mt-1 tabular-nums">
            {backtestResult.winRatePercent}%
          </div>
          <div className="text-[10px] text-content-secondary mt-0.5">Profitable closed cycles</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background-surface shadow-panel">
          <div className="text-[11px] text-content-muted font-medium">Trades Executed</div>
          <div className="text-lg font-bold text-content-primary mt-1 tabular-nums">
            {backtestResult.totalTrades}
          </div>
          <div className="text-[10px] text-content-secondary mt-0.5">Turnover entries/exits</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background-surface shadow-panel">
          <div className="text-[11px] text-content-muted font-medium">Friction Fees Paid</div>
          <div className="text-lg font-bold text-content-muted mt-1 tabular-nums">
            ${backtestResult.totalFeesPaid.toLocaleString()}
          </div>
          <div className="text-[10px] text-content-secondary mt-0.5">Total transaction costs</div>
        </div>
      </div>

      {/* Equity Curve SVG Chart */}
      <div className="p-5 rounded-xl border border-border/80 bg-background-surface shadow-panel space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-sm font-bold text-content-primary">Strategy Equity Curve vs {benchmark}</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
              <span className="text-content-secondary">Strategy: {formatCurrency(backtestResult.finalPortfolioValue)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
              <span className="text-content-secondary">Benchmark: {benchmark}</span>
            </div>
          </div>
        </div>

        {/* SVG Equity Curve */}
        <div className="h-[240px] w-full relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="stratEqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Baseline 0% */}
            <line x1="0" y1="160" x2="600" y2="160" stroke="#243D57" strokeWidth="1" />

            {/* Benchmark line */}
            <polyline
              points={eqCurve
                .map((pt, idx) => {
                  const x = (idx / (n - 1)) * 600
                  const y = 160 - (pt.benchmarkReturnPercent / 45) * 130
                  return `${x},${y}`
                })
                .join(' ')}
              fill="none"
              stroke="#168BFF"
              strokeWidth="1.75"
              strokeDasharray="4,4"
            />

            {/* Strategy Area & Line */}
            <polygon
              points={`0,160 ${eqCurve
                .map((pt, idx) => {
                  const x = (idx / (n - 1)) * 600
                  const y = 160 - (pt.strategyReturnPercent / 45) * 130
                  return `${x},${y}`
                })
                .join(' ')} 600,160`}
              fill="url(#stratEqGrad)"
            />

            <polyline
              points={eqCurve
                .map((pt, idx) => {
                  const x = (idx / (n - 1)) * 600
                  const y = 160 - (pt.strategyReturnPercent / 45) * 130
                  return `${x},${y}`
                })
                .join(' ')}
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>

      {/* Trade Execution Log Table */}
      <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel space-y-3">
        <h3 className="text-sm font-bold text-content-primary">Trade Execution Log (Zero Look-Ahead Bias)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-content-muted border-b border-border/40">
                <th className="py-2.5 font-medium">Date</th>
                <th className="py-2.5 font-medium">Asset</th>
                <th className="py-2.5 font-medium">Action</th>
                <th className="py-2.5 font-medium text-right">Execution Price</th>
                <th className="py-2.5 font-medium text-right">Shares</th>
                <th className="py-2.5 font-medium text-right">Friction Fee</th>
                <th className="py-2.5 font-medium text-right">Portfolio Value After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {backtestResult.trades.map((t) => (
                <tr key={t.id} className="hover:bg-background-hover/40 transition">
                  <td className="py-2 text-content-secondary font-mono">{t.date}</td>
                  <td className="py-2 font-bold text-content-primary">{t.symbol}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.action === 'BUY'
                          ? 'bg-financial-positive/20 text-financial-positive'
                          : 'bg-financial-negative/20 text-financial-negative'
                      }`}
                    >
                      {t.action}
                    </span>
                  </td>
                  <td className="py-2 text-right font-medium text-content-primary tabular-nums">
                    ${t.price.toFixed(2)}
                  </td>
                  <td className="py-2 text-right text-content-secondary tabular-nums">
                    {t.shares.toFixed(2)}
                  </td>
                  <td className="py-2 text-right text-content-muted tabular-nums">
                    ${t.fee.toFixed(2)}
                  </td>
                  <td className="py-2 text-right font-bold text-content-primary tabular-nums">
                    {formatCurrency(t.portfolioValueAfter)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
