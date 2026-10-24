import React, { useState } from 'react'
import { PieChart } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const AssetAllocation: React.FC = () => {
  const { allocation, summary, formatCurrency } = useApp()
  const [groupBy, setGroupBy] = useState<'assetClass' | 'sector'>('assetClass')

  // Donut chart calculations
  const totalVal = summary.totalValue || 248560
  const radius = 54
  const strokeWidth = 14
  const circumference = 2 * Math.PI * radius // ~339.29

  // Calculate accumulated offsets for each segment
  let accumulatedPercent = 0
  const segments = allocation.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
    const strokeDashoffset = -(accumulatedPercent / 100) * circumference
    accumulatedPercent += item.percentage
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    }
  })

  return (
    <div className="rounded-xl border border-border/80 bg-background-surface p-5 shadow-panel flex flex-col justify-between">
      {/* Header with GroupBy Dropdown */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h3 className="text-sm font-bold text-content-primary">Asset Allocation</h3>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as any)}
          className="text-xs font-semibold bg-background-elevated border border-border text-content-secondary px-2.5 py-1 rounded-lg focus:outline-none focus:border-brand-cyan cursor-pointer"
        >
          <option value="assetClass">By Asset Class</option>
          <option value="sector">By Sector</option>
        </select>
      </div>

      {/* Donut Chart & Legend Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-2">
        {/* SVG Donut with Center Value ($248.6K Total Value) */}
        <div className="relative w-[140px] h-[140px] flex items-center justify-center shrink-0">
          <svg className="w-[140px] h-[140px] -rotate-90" viewBox="0 0 140 140">
            {/* Background Ring Track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#132338"
              strokeWidth={strokeWidth}
            />

            {/* Allocation Segments */}
            {segments.map((seg) => (
              <circle
                key={seg.category}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-300 hover:opacity-90"
              />
            ))}
          </svg>

          {/* Center Text Matching Reference: "$248.6K Total Value" */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-base font-extrabold text-content-primary tabular-nums tracking-tight">
              {formatCurrency(totalVal, true)}
            </span>
            <span className="text-[10px] font-medium text-content-muted">Total Value</span>
          </div>
        </div>

        {/* Legend Breakdown with Exact Values & Percentages */}
        <div className="space-y-2 w-full text-xs">
          {allocation.map((item) => (
            <div key={item.category} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-content-secondary">{item.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-content-primary tabular-nums w-8 text-right">
                  {Math.round(item.percentage)}%
                </span>
                <span className="font-medium text-content-muted tabular-nums w-16 text-right">
                  {formatCurrency(item.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
