"use client"

import { useState } from "react"
import { useCryptoPrices } from "@/hooks/use-crypto-prices"
import { CRYPTO_ASSETS } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CryptoConverterProps {
  prices?: Record<string, number | null>
}

export function CryptoConverter({ prices: propPrices }: CryptoConverterProps) {
  const { prices: hookPrices } = useCryptoPrices()
  const prices = propPrices || hookPrices
  const [fromCrypto, setFromCrypto] = useState("BTC")
  const [toCrypto, setToCrypto] = useState("USDT")
  const [amount, setAmount] = useState("1")

  const fromPrice = prices?.[fromCrypto] || 0
  const toPrice = prices?.[toCrypto] || 0
  const result = fromPrice && toPrice ? (Number.parseFloat(amount) * fromPrice) / toPrice : 0

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-accent">Crypto Converter</CardTitle>
        <CardDescription>Convert between cryptocurrencies using live prices</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* From */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">From</label>
            <div className="space-y-2">
              <select
                value={fromCrypto}
                onChange={(e) => setFromCrypto(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:border-accent"
              >
                {Object.entries(CRYPTO_ASSETS).map(([key, asset]) => (
                  <option key={key} value={key}>
                    {asset.symbol} - {asset.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.00000001"
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* To */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">To</label>
            <div className="space-y-2">
              <select
                value={toCrypto}
                onChange={(e) => setToCrypto(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:border-accent"
              >
                {Object.entries(CRYPTO_ASSETS).map(([key, asset]) => (
                  <option key={key} value={key}>
                    {asset.symbol} - {asset.name}
                  </option>
                ))}
              </select>
              <div className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground font-semibold">
                {result.toFixed(8)}
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="bg-secondary border border-border p-3 rounded text-center">
          <p className="text-sm text-muted-foreground mb-1">Exchange Rate</p>
          <p className="font-bold text-accent">
            1 {fromCrypto} = {(fromPrice / toPrice).toFixed(8)} {toCrypto}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
