"use client"

import { useCryptoPrices } from "@/hooks/use-crypto-prices"
import { CRYPTO_ASSETS } from "@/lib/constants"

export function LivePriceTicker() {
  const { prices } = useCryptoPrices()

  return (
    <div className="bg-card border-b border-border px-4 py-3 overflow-hidden">
      <div className="flex animate-slide-up gap-8 overflow-x-auto pb-2 scrollbar-hide">
        {Object.entries(CRYPTO_ASSETS).map(([key, asset]) => (
          <div key={key} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm">{asset.icon}</span>
            <span className="font-medium text-foreground">{asset.symbol}</span>
            <span className="text-accent font-bold">${(prices?.[key] || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
