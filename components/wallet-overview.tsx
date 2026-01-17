"use client"

import { WalletCard } from "./wallet-card"
import { CRYPTO_ASSETS } from "@/lib/constants"

interface WalletOverviewProps {
  walletData: {
    btcBalance: number
    ethBalance: number
    ltcBalance: number
    usdtBalance: number
  }
  cryptoPrices: Record<string, number | null>
}

export function WalletOverview({ walletData, cryptoPrices }: WalletOverviewProps) {
  const totalUsdValue =
    (walletData.btcBalance * (cryptoPrices?.BTC || 0) || 0) +
    (walletData.ethBalance * (cryptoPrices?.ETH || 0) || 0) +
    (walletData.ltcBalance * (cryptoPrices?.LTC || 0) || 0) +
    (walletData.usdtBalance * (cryptoPrices?.USDT || 0) || 0)

  return (
    <div className="space-y-6">
      {/* Total Balance */}
      <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-xl p-6 md:p-10 shadow-lg shadow-accent/5">
        <p className="text-muted-foreground text-[10px] md:text-sm font-bold uppercase tracking-widest mb-2">Portfolio Value</p>
        <p className="text-3xl md:text-5xl font-extrabold text-accent">
          ${totalUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Crypto Assets Grid */}
      <div>
        <h3 className="text-base md:text-lg font-bold text-accent mb-4 px-1">CRYPTO ASSETS</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {Object.entries(CRYPTO_ASSETS).map(([key, asset]) => {
            const balance = walletData[`${key.toLowerCase()}Balance` as keyof typeof walletData]
            const price = cryptoPrices?.[key] || 0
            const usdValue = balance * price

            return (
              <WalletCard
                key={key}
                symbol={asset.symbol}
                name={asset.name}
                balance={balance}
                usdValue={usdValue}
                icon={asset.icon}
                color={asset.color}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
