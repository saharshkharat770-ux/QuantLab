import React from 'react'
import { HeroBanner } from './HeroBanner'
import { FilterBar } from './FilterBar'
import { KpiCards } from './KpiCards'
import { PerformanceChart } from './PerformanceChart'
import { RiskSnapshot } from './RiskSnapshot'
import { AssetAllocation } from './AssetAllocation'
import { TopHoldingsTable } from './TopHoldingsTable'
import { RecentActivity } from './RecentActivity'

export const OverviewDashboard: React.FC = () => {
  return (
    <div className="space-y-5 pb-8">
      {/* Hero Welcome Banner */}
      <HeroBanner />

      {/* Timeframe & Action Filter Bar */}
      <FilterBar />

      {/* 4 Primary KPI Cards */}
      <KpiCards />

      {/* Middle Row: Performance Chart (Left ~68%) & Risk Snapshot (Right ~32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <PerformanceChart />
        </div>
        <div className="lg:col-span-4">
          <RiskSnapshot />
        </div>
      </div>

      {/* Bottom Row: Asset Allocation (33%), Top Holdings (34%), Recent Activity (33%) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AssetAllocation />
        <TopHoldingsTable />
        <RecentActivity />
      </div>
    </div>
  )
}
