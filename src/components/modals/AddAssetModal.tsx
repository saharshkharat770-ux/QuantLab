import React, { useState } from 'react'
import { X, Plus, DollarSign, Layers } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CURATED_ASSETS } from '../../data/demo/assets'
import { AssetClass } from '../../types/portfolio'

export const AddAssetModal: React.FC = () => {
  const { isAddAssetModalOpen, setIsAddAssetModalOpen, addHolding, addNotification } = useApp()

  const [symbol, setSymbol] = useState('NVDA')
  const [name, setName] = useState('NVIDIA Corporation')
  const [assetClass, setAssetClass] = useState<AssetClass>('Equities')
  const [sector, setSector] = useState('Technology')
  const [quantity, setQuantity] = useState('10')
  const [buyPrice, setBuyPrice] = useState('138.20')
  const [currentPrice, setCurrentPrice] = useState('138.21')

  if (!isAddAssetModalOpen) return null

  const handleSymbolChange = (sym: string) => {
    setSymbol(sym)
    const preset = CURATED_ASSETS.find((a) => a.symbol === sym)
    if (preset) {
      setName(preset.name)
      setAssetClass(preset.assetClass)
      setSector(preset.sector || 'General')
      setBuyPrice(preset.price.toFixed(2))
      setCurrentPrice(preset.price.toFixed(2))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const qty = parseFloat(quantity)
    const buy = parseFloat(buyPrice)
    const cur = parseFloat(currentPrice)

    if (isNaN(qty) || qty <= 0) {
      addNotification('Invalid Input', 'Quantity must be a positive number.', 'error')
      return
    }
    if (isNaN(buy) || buy <= 0) {
      addNotification('Invalid Input', 'Purchase price must be positive.', 'error')
      return
    }

    addHolding({
      symbol: symbol.toUpperCase(),
      name,
      assetClass,
      sector,
      quantity: qty,
      buyPrice: buy,
      currentPrice: cur,
      dayChangePercent: 0.5,
      currency: 'USD',
    })

    setIsAddAssetModalOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-background-surface shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background-elevated">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-blue/20 text-brand-cyan flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-content-primary">Add Asset to Portfolio</h3>
          </div>
          <button
            onClick={() => setIsAddAssetModalOpen(false)}
            className="p-1 rounded text-content-muted hover:text-content-primary transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Preset Symbol Picker */}
          <div>
            <label className="block font-semibold text-content-secondary mb-1">Select Asset Symbol</label>
            <div className="flex gap-2">
              <select
                value={symbol}
                onChange={(e) => handleSymbolChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background-elevated border border-border text-content-primary font-bold focus:outline-none focus:border-brand-cyan"
              >
                {CURATED_ASSETS.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} - {a.name} (${a.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Name & Asset Class */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-content-secondary mb-1">Company / Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background-elevated border border-border text-content-primary font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-content-secondary mb-1">Asset Class</label>
              <select
                value={assetClass}
                onChange={(e) => setAssetClass(e.target.value as AssetClass)}
                className="w-full px-3 py-2 rounded-lg bg-background-elevated border border-border text-content-primary font-semibold"
              >
                <option value="Equities">Equities</option>
                <option value="Bonds">Bonds</option>
                <option value="ETFs">ETFs</option>
                <option value="Cash">Cash</option>
                <option value="Crypto">Crypto</option>
              </select>
            </div>
          </div>

          {/* Quantity & Buy Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-content-secondary mb-1">Shares / Quantity</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background-elevated border border-border text-content-primary font-bold text-right"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-content-secondary mb-1">Purchase Buy Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background-elevated border border-border text-content-primary font-bold text-right"
                required
              />
            </div>
          </div>

          {/* Estimated Total Notional */}
          <div className="p-3 rounded-lg border border-border/80 bg-background-elevated flex items-center justify-between">
            <span className="text-content-muted">Estimated Trade Value:</span>
            <span className="font-extrabold text-brand-cyan tabular-nums">
              ${((parseFloat(quantity) || 0) * (parseFloat(buyPrice) || 0)).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/40">
            <button
              type="button"
              onClick={() => setIsAddAssetModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-border text-content-secondary hover:text-content-primary font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-brand-blue hover:brightness-110 active:scale-95 text-white font-bold shadow-glow"
            >
              Confirm Addition
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
