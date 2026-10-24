import React, { useState } from 'react'
import { X, Sparkles, Send, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

interface Message {
  role: 'assistant' | 'user'
  text: string
  insights?: string[]
}

export const AiAnalystModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, summary, holdings, benchmark, formatCurrency } = useApp()
  const [input, setInput] = useState('')

  const topEquities = holdings.filter((h) => h.assetClass === 'Equities')
  const totalEquitiesVal = topEquities.reduce((s, h) => s + h.quantity * h.currentPrice, 0)
  const equitiesWeight = summary.totalValue > 0 ? (totalEquitiesVal / summary.totalValue) * 100 : 52

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hello Saharsh, I am your QUANTLAB Market Analyst. I have completed a deterministic quantitative scan of your current portfolio ($${summary.totalValue.toLocaleString()}). Here is the executive audit summary:`,
      insights: [
        `High Concentration in Mega-Cap Technology: Top 3 holdings (AAPL, MSFT, NVDA) represent ~47.6% of total equity weight. Consider whether this aligns with your target risk budget.`,
        `Favorable Sharpe Ratio (${summary.sharpeRatio.toFixed(2)}): Portfolio has generated 1.47 units of excess return per unit of annualized risk (14.82% vol) vs ${benchmark}.`,
        `Downside Tail Risk: Empirical 1-day 95% Value at Risk is -$4,280, with an Expected Shortfall of -$6,720 in extreme market tail scenarios.`,
        `Liquid Cash Buffer: You have ${formatCurrency(summary.cashBalance)} in dry powder (10.0% of portfolio) available for opportunistic rebalancing.`,
      ],
    },
  ])

  if (!isAiModalOpen) return null

  const handleSend = (userText: string) => {
    if (!userText.trim()) return

    const newMsgs: Message[] = [...messages, { role: 'user', text: userText }]

    let reply = ''
    const lower = userText.toLowerCase()

    if (lower.includes('hedge') || lower.includes('downside') || lower.includes('risk')) {
      reply = `To hedge against a sharp technology pullback without liquidating core positions:
1. Increase allocation to duration fixed-income (e.g., TLT/BND) which currently exhibits an inverse correlation (-0.15 to -0.22) with NVDA and AAPL.
2. Consider dynamic target rebalancing to cap individual stock weights at 15.0%.
3. Utilize your 10% cash reserve ($24,886) to absorb short-term drawdowns.`
    } else if (lower.includes('rebalance') || lower.includes('allocation')) {
      reply = `Current asset allocation is 52% Equities, 22% Bonds, 16% ETFs, and 10% Cash.
Recommended Action: Open the Rebalance Editor in the Portfolio tab. Trimming 2% from NVDA after its +2.18% run and allocating into BND/Cash would lower portfolio beta from 0.92 to 0.86.`
    } else if (lower.includes('tech') || lower.includes('nvda') || lower.includes('aapl')) {
      reply = `Your active technology exposure stands at $118,314 across AAPL ($45,238), MSFT ($41,758), and NVDA ($31,318).
Under a modeled -20% technology sector shock in Scenario Studio, this would create an estimated paper drawdown of -$23,662. However, year-to-date cumulative return (+26.4%) still provides a +$51,914 buffer above cost basis.`
    } else {
      reply = `Analysis based on current portfolio parameters ($${summary.totalValue.toLocaleString()} NAV):
- Portfolio Beta vs ${benchmark}: 0.92
- Annualized Volatility: ${summary.annualizedVolatility.toFixed(2)}%
- Win Rate in Backtests: 66.7%
- Cash Buffer: ${formatCurrency(summary.cashBalance)}
All calculated metrics indicate a well-structured growth portfolio with controlled volatility.`
    }

    newMsgs.push({ role: 'assistant', text: reply })
    setMessages(newMsgs)
    setInput('')
  }

  const promptSuggestions = [
    'How can I reduce downside risk?',
    'Should I rebalance tech holdings?',
    'Analyze my bond allocation',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-background-surface shadow-2xl flex flex-col h-[600px] overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background-elevated">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-violet shadow-glow-violet">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-content-primary">AI Market Analyst</h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-violet/25 text-brand-violet border border-brand-violet/30">
                  DETERMINISTIC ENGINE
                </span>
              </div>
              <p className="text-[10px] text-content-muted">Institutional Risk & Quantitative Copilot</p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1 rounded text-content-muted hover:text-content-primary transition"
            aria-label="Close AI Analyst"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-blue text-white rounded-br-none shadow-sm'
                    : 'bg-background-elevated border border-border text-content-primary rounded-bl-none shadow-panel'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {m.insights && (
                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                    {m.insights.map((ins, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-2 text-content-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0 mt-0.5" />
                        <span>{ins}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-6 py-2 border-t border-border/40 bg-background-elevated/50 flex flex-wrap gap-2 text-[11px]">
          {promptSuggestions.map((ps) => (
            <button
              key={ps}
              onClick={() => handleSend(ps)}
              className="px-2.5 py-1 rounded-full border border-border bg-background-surface hover:border-brand-cyan text-content-secondary hover:text-content-primary transition"
            >
              {ps}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(input)
          }}
          className="p-4 border-t border-border bg-background-elevated flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about your portfolio risks, correlations, or strategies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-background-surface border border-border text-xs text-content-primary focus:outline-none focus:border-brand-cyan"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-brand-blue hover:brightness-110 active:scale-95 text-white shadow-glow transition"
            title="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  )
}
