import { AssetClass } from './portfolio'

export interface MarketAsset {
  symbol: string
  name: string
  assetClass: AssetClass
  sector?: string
  price: number
  dayChangeDollar: number
  dayChangePercent: number
  marketCap?: string
  volume?: string
  peRatio?: number
  high52Week?: number
  low52Week?: number
  sparkline: number[]
  historicalPrices: Array<{ date: string; close: number; volume: number }>
}

export interface WatchlistItem {
  symbol: string
  name: string
  assetClass: AssetClass
  targetBuyPrice?: number
  alertEnabled: boolean
  addedDate: string
}

export interface MarketIndexSummary {
  symbol: string
  name: string
  value: number
  changePercent: number
}
