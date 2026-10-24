import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../../App'

describe('QUANTLAB UI & Workflow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the complete QUANTLAB terminal interface with branding', () => {
    render(<App />)

    // Verify Brand Logo and wordmark
    expect(screen.getByText('QUANT')).toBeInTheDocument()
    expect(screen.getByText('LAB')).toBeInTheDocument()
    expect(screen.getByText(/Analyze · Simulate · Invest/i)).toBeInTheDocument()

    // Verify Welcome Hero Banner
    expect(screen.getByText(/Welcome Back, Saharsh/i)).toBeInTheDocument()
    expect(screen.getByText('Portfolio Intelligence')).toBeInTheDocument()
    expect(screen.getByText('Risk, performance, and allocation in one view.')).toBeInTheDocument()

    // Verify Top Header Elements
    expect(screen.getByText('Markets Open')).toBeInTheDocument()
    expect(screen.getByText('SK')).toBeInTheDocument()
  })

  it('displays the 4 reference KPI cards with accurate financial numbers', () => {
    render(<App />)

    // Portfolio Value ($248,560.42)
    expect(screen.getByText('Portfolio Value')).toBeInTheDocument()
    expect(screen.getByText('$248,560.42')).toBeInTheDocument()

    // Daily P&L (+$2,184.87 (+0.89%))
    expect(screen.getByText('Daily P&L')).toBeInTheDocument()
    expect(screen.getAllByText(/\+\$2,184/i).length).toBeGreaterThan(0)

    // Annualized Volatility (14.82%)
    expect(screen.getByText('Annualized Volatility')).toBeInTheDocument()
    expect(screen.getByText('14.82%')).toBeInTheDocument()

    // Sharpe Ratio (1.47)
    expect(screen.getByText('Sharpe Ratio')).toBeInTheDocument()
    expect(screen.getByText('1.47')).toBeInTheDocument()
  })

  it('displays the Risk Snapshot semicircle gauge and statistics matching reference', () => {
    render(<App />)

    expect(screen.getByText('Risk Snapshot')).toBeInTheDocument()
    expect(screen.getByText('62')).toBeInTheDocument()
    expect(screen.getByText('/100')).toBeInTheDocument()
    expect(screen.getByText('MEDIUM RISK')).toBeInTheDocument()

    // Value at Risk (95%) and Expected Shortfall
    expect(screen.getByText('Value at Risk (95%)')).toBeInTheDocument()
    expect(screen.getByText('-$4,280')).toBeInTheDocument()
    expect(screen.getByText('Expected Shortfall (95%)')).toBeInTheDocument()
    expect(screen.getByText('-$6,720')).toBeInTheDocument()

    // Max Drawdown, Beta, Correlation
    expect(screen.getByText('-8.4%')).toBeInTheDocument()
    expect(screen.getByText('0.92')).toBeInTheDocument()
    expect(screen.getByText('0.76')).toBeInTheDocument()
  })

  it('displays the Asset Allocation donut breakdown matching reference', () => {
    render(<App />)

    expect(screen.getByText('Asset Allocation')).toBeInTheDocument()
    expect(screen.getByText('$248.6K')).toBeInTheDocument()
    expect(screen.getByText('52%')).toBeInTheDocument()
    expect(screen.getByText('22%')).toBeInTheDocument()
    expect(screen.getByText('16%')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
  })

  it('switches navigation views cleanly across all 9 terminal tabs', () => {
    render(<App />)

    // Switch to Portfolio view
    fireEvent.click(screen.getByRole('button', { name: 'Navigate to Portfolio' }))
    expect(screen.getByText('Portfolio Workspace')).toBeInTheDocument()

    // Switch to Risk Lab
    fireEvent.click(screen.getByRole('button', { name: 'Navigate to Risk Lab' }))
    expect(screen.getByText('Quantitative Risk Lab')).toBeInTheDocument()

    // Switch to Backtesting
    fireEvent.click(screen.getByRole('button', { name: 'Navigate to Backtesting' }))
    expect(screen.getByText('Algorithmic Backtesting Lab')).toBeInTheDocument()

    // Switch to Scenario Studio
    fireEvent.click(screen.getByRole('button', { name: 'Navigate to Scenario Studio' }))
    expect(screen.getByText('Scenario Studio & Stress Lab')).toBeInTheDocument()

    // Switch to Reports
    fireEvent.click(screen.getByRole('button', { name: 'Navigate to Reports' }))
    expect(screen.getByText('Reports & Fact Sheets')).toBeInTheDocument()

    // Switch to Watchlist
    fireEvent.click(screen.getByRole('button', { name: 'Navigate to Watchlist' }))
    expect(screen.getByText('Asset Watchlist')).toBeInTheDocument()

    // Switch to Settings
    fireEvent.click(screen.getByRole('button', { name: 'Navigate to Settings' }))
    expect(screen.getByText('Platform Settings')).toBeInTheDocument()

    // Return to Overview
    fireEvent.click(screen.getByRole('button', { name: 'Navigate to Overview' }))
    expect(screen.getByText(/Welcome Back, Saharsh/i)).toBeInTheDocument()
  })

  it('opens and closes the Add Asset modal smoothly', () => {
    render(<App />)

    const addAssetBtn = screen.getByRole('button', { name: /Add Asset/i })
    fireEvent.click(addAssetBtn)

    expect(screen.getByText('Add Asset to Portfolio')).toBeInTheDocument()
    expect(screen.getByText('Select Asset Symbol')).toBeInTheDocument()

    // Close modal
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelBtn)

    expect(screen.queryByText('Add Asset to Portfolio')).not.toBeInTheDocument()
  })

  it('opens and closes the AI Market Analyst modal smoothly', () => {
    render(<App />)

    const askAiBtn = screen.getByRole('button', { name: /Ask AI/i })
    fireEvent.click(askAiBtn)

    expect(screen.getByText('DETERMINISTIC ENGINE')).toBeInTheDocument()
    expect(screen.getByText(/Institutional Risk & Quantitative Copilot/i)).toBeInTheDocument()

    // Close button
    const closeBtn = screen.getByLabelText(/Close AI Analyst/i)
    fireEvent.click(closeBtn)

    expect(screen.queryByText('DETERMINISTIC ENGINE')).not.toBeInTheDocument()
  })

  it('toggles timeframes on filter bar', () => {
    render(<App />)

    const btn1M = screen.getByRole('button', { name: '1M' })
    fireEvent.click(btn1M)
    expect(btn1M).toHaveClass('bg-brand-blue')

    const btnALL = screen.getByRole('button', { name: 'ALL' })
    fireEvent.click(btnALL)
    expect(btnALL).toHaveClass('bg-brand-blue')
  })
})
