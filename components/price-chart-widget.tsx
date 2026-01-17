"use client"

import { useCryptoPrices } from "@/hooks/use-crypto-prices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CRYPTO_ASSETS } from "@/lib/constants"

interface PriceChartWidgetProps {
  compact?: boolean
  prices?: Record<string, number | null>
}

export function PriceChartWidget({ compact = false, prices: propPrices }: PriceChartWidgetProps) {
  const { prices: hookPrices } = useCryptoPrices()
  const prices = propPrices || hookPrices

  if (compact) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-accent">Live Prices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(CRYPTO_ASSETS).map(([key, asset]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-foreground flex items-center gap-2">
                <span>{asset.icon}</span>
                {asset.symbol}
              </span>
              <span className="font-bold text-accent">${(prices?.[key] || 0).toFixed(2)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-accent">Current Market Prices</CardTitle>
        <CardDescription>Real-time cryptocurrency prices from CoinGecko</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(CRYPTO_ASSETS).map(([key, asset]) => (
            <div key={key} className="bg-secondary border border-border p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">{asset.icon}</div>
              <p className="text-sm text-muted-foreground">{asset.symbol}</p>
              <p className="text-xl font-bold text-accent mt-2">${(prices?.[key] || 0).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{asset.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
