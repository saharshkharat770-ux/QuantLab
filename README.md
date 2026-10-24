# QUANTLAB — Institutional Quantitative Finance & Portfolio Analytics Platform

> **ANALYZE · SIMULATE · INVEST**  
> An institutional-grade, browser-first quantitative finance terminal delivering multi-asset portfolio analytics, parametric & historical risk simulation, and algorithmic backtesting with **zero API keys required**.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-29%20Passed-00D6A0?style=flat-square&logo=vitest)](https://vitest.dev/)

---

## 1. Executive Summary & Design System

QUANTLAB is designed to mirror high-performance institutional analytics terminals (Bloomberg, FactSet, Aladdin, Axioma) while running **100% client-side** directly in modern web browsers.

### Visual Architecture & Palette
- **Deep Slate Canvas**: `#050B14` (root background), `#07111F` (navigation rail), `#0A1524` (elevated surface panels), `#1B3048` (hairline borders).
- **Institutional Accents**: `#22D3EE` (cyan metric highlights), `#168BFF` (primary cobalt action), `#9A7BFF` (AI copilot violet).
- **Financial Status Colors**: `#00D6A0` (positive alpha/gains), `#FF647C` (negative drawdowns/losses), `#FFB547` (moderate risk/warnings).
- **Typography & Numeral Precision**: Inter paired with JetBrains Mono for strict tabular alignment (`font-variant-numeric: tabular-nums`).

---

## 2. Key Modules & Functional Capabilities

### 1. Overview Dashboard (Terminal Home)
- **Constellation Hero Banner**: Real-time market status, system clock, and dynamic institutional welcome.
- **Timeframe Selector**: Instant filtering across `1D`, `1W`, `1M`, `3M`, `1Y`, and `ALL` (2024 YTD).
- **Core Financial KPIs**:
  - **Portfolio Value**: `$248,560.42` with balance concealment privacy toggle.
  - **Daily P&L**: `+$2,184.87 (+0.89%)` with positive volume distribution bar graphic.
  - **Annualized Volatility**: `14.82%` based on 252-day historical standard deviation.
  - **Sharpe Ratio**: `1.47` with 4.5% risk-free rate hurdle benchmark.
- **Dual Performance Curve**: High-resolution interactive SVG comparison of Portfolio vs. S&P 500 benchmark (+26.4% vs +18.7% YTD), with Aug 14 milestone hover tooltip (+28.3% / $232,420 vs +19.1%).
- **Risk Snapshot Gauge**: Calibrated 62/100 semicircle risk meter (`MEDIUM RISK`), 1-day 95% Value at Risk (`-$4,280`), Expected Shortfall (`-$6,720`), Maximum Drawdown (`-8.4%`), Beta (`0.92`), and Correlation (`0.76`).
- **Asset Allocation Donut**: Visual capital weights across Equities (52%), Bonds (22%), ETFs (16%), and Liquid Cash (10%).
- **Top Holdings & Audit Feed**: Real-time pricing, day changes, unrealized P&L, and chronological event ledger.

### 2. Portfolio Workspace
- Complete positions table with live valuations, cost basis, unrealized P&L, and weight calculations.
- **CRUD Position Controls**: Add, edit quantity/price, or liquidate holdings with instant recalculation.
- **Interactive Rebalancing Studio**: Target allocation sliders with automatic drift computation and single-click portfolio re-alignment.
- **Institutional CSV Export**: Downloadable full portfolio audit files.

### 3. Markets Intelligence
- Searchable market asset universe across Equities, Fixed Income, and Broad Market ETFs.
- Detailed quote card with 52-week ranges, market cap, P/E ratio, dividend yields, and beta.
- Normalized comparative price chart over 2024.

### 4. Quantitative Risk Lab
- Interactive confidence level slider (`90%`, `95%`, `99%`) with live VaR and Expected Shortfall recomputation.
- **Underwater Drawdown Chart**: Historical peak-to-trough decline tracking down to the August 5 market correction (-8.4%).
- **Empirical Return Distribution**: 25-bucket histogram of daily returns fitted against a normal curve.
- **Cross-Asset Correlation Matrix**: Heatmap displaying Pearson correlation coefficients across all active portfolio assets.

### 5. Algorithmic Backtesting Lab
- Chronological backtest engine with strict **zero look-ahead bias**.
- **Strategy Implementations**: Simple Moving Average (SMA) Crossover (e.g. 10/30, 20/50), Buy & Hold, and Volatility Target.
- **Realistic Friction**: Configurable transaction fee (bps) and execution slippage (bps) deducted on every trade.
- Full equity curve visualization, trade audit logs, CAGR, Sharpe ratio, win rate, and profit factor.

### 6. Scenario Studio & Stress Testing
- **Historical Crisis Presets**:
  - *2008 Global Financial Crisis*: -38% equities shock, credit spread blowout, flight to liquidity.
  - *Tech Bubble Deflation*: -38% tech correction, multiple compression, defensive rotation.
  - *Aggressive Rate Hikes*: +300 bps interest rate shock, duration bond drawdown (-18%).
  - *Stagflation & Energy Shock*: Supply disruption, commodity spike, margin contraction.
- **Custom Stress Shocks**: Real-time parametric sliders for equity market shock, interest rate movement, and sector overrides.
- **Monte Carlo Simulation**: 500+ path Geometric Brownian Motion engine with deterministic seeded RNG (Box-Muller normal transform), displaying 5th, 25th, 50th, 75th, and 95th percentile projection fans and probability of capital loss.

### 7. Institutional Reports & Fact Sheets
- Professional printable/exportable Executive Fact Sheet with regulatory disclosures, asset tables, and risk metrics.
- Comprehensive CSV download options for holdings, historical returns, and risk metrics.

### 8. Watchlist & Alerts
- Real-time price tracking and target price proximity alerts.

### 9. Platform Settings
- Multi-currency support (`USD $`, `EUR €`, `GBP £`, `INR ₹`).
- Benchmark selection (`S&P 500`, `NASDAQ 100`, `NIFTY 50`).
- State management and 1-click **Reset Verified Demo Data** action.

### 10. AI Market Analyst [BETA]
- Deterministic institutional copilot analyzing portfolio concentration, factor tilts, tail risks, and tax-loss harvesting scenarios without remote API dependencies.

---

## 3. Quantitative Methodology

### Annualized Volatility
Calculated across daily simple returns $r_t = \frac{P_t - P_{t-1}}{P_{t-1}}$:
$$\sigma_{\text{ann}} = \sqrt{\frac{1}{N-1} \sum_{t=1}^N (r_t - \bar{r})^2} \times \sqrt{252} \times 100$$

### Value at Risk (VaR) & Expected Shortfall (CVaR)
Historical quantile empirical loss at confidence level $\alpha$ (e.g., $\alpha = 0.95$):
$$\text{VaR}_\alpha = - |Q_{1-\alpha}(r) \times V_{\text{portfolio}}|$$
$$\text{ES}_\alpha = - \left| \frac{1}{|T_{\text{tail}}|} \sum_{r_i \in T_{\text{tail}}} r_i \times V_{\text{portfolio}} \right|, \quad \text{where } T_{\text{tail}} = \{r \mid r \le Q_{1-\alpha}(r)\}$$

### Beta & Pearson Correlation
Relative to benchmark returns $r_b$:
$$\beta = \frac{\text{Cov}(r_p, r_b)}{\text{Var}(r_b)}, \quad \rho = \frac{\text{Cov}(r_p, r_b)}{\sigma_p \sigma_b}$$

### Sharpe & Sortino Ratios
With annualized risk-free rate $R_f = 4.5\%$:
$$\text{Sharpe} = \frac{R_p - R_f}{\sigma_p}, \quad \text{Sortino} = \frac{R_p - R_f}{\sqrt{\frac{1}{M}\sum_{r_i < 0} r_i^2} \times \sqrt{252}}$$

---

## 4. Verification & Automated Testing

The codebase includes automated unit and integration tests covering mathematical formulas, edge cases, deterministic PRNGs, and React user interactions.

```bash
# Run complete test suite (29 tests)
npm test

# Build production bundle
npm run build
```

### Verified Test Summary:
- `src/test/engine/portfolio.test.ts`: 3 passed (market value, daily P&L, asset class allocation)
- `src/test/engine/returns.test.ts`: 4 passed (simple & log returns, sample variance, covariance, correlation)
- `src/test/engine/risk.test.ts`: 8 passed (volatility, historical VaR, Expected Shortfall, max drawdown, beta, Sharpe, composite risk)
- `src/test/engine/backtest.test.ts`: 3 passed (SMA calculation, Buy & Hold, trade logs with friction)
- `src/test/engine/scenario.test.ts`: 3 passed (stress presets, capital preservation, Monte Carlo determinism)
- `src/test/ui/components.test.tsx`: 8 passed (branding, KPI cards, semicircle gauge, donut chart, 9-tab navigation, modal workflows, filter pills)

---

## 5. Deployment Guide (GitHub Pages)

### Local Development
```bash
# Clone the repository
git clone https://github.com/<username>/quantlab.git
cd quantlab

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Preview
```bash
# Build production bundle (outputs to /dist)
npm run build

# Preview production build locally
npm run preview
```

### GitHub Pages Deployment via GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy QUANTLAB to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run test suite
        run: npm test

      - name: Build production bundle
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 6. Zero API Key Commitment

QUANTLAB requires **no external API keys, environment secrets, or paid subscriptions**. All historical series, benchmark curves, asset fundamentals, stress scenarios, and Monte Carlo models run deterministically inside the client browser.
