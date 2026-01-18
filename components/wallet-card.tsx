"use client"

interface WalletCardProps {
  symbol: string
  name: string
  balance: number
  usdValue: number
  icon: string
  color: string
}

export function WalletCard({ symbol, name, balance, usdValue, icon, color }: WalletCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 hover:border-accent/50 transition-all animate-slide-up group">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div
            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-lg font-bold text-black shadow-inner"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] md:text-sm text-muted-foreground truncate">{name}</p>
            <p className="text-xs md:text-base font-bold text-foreground">{symbol}</p>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm md:text-2xl font-bold text-accent-thick truncate">
          {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: symbol === "USDT" ? 2 : 6 })}
        </p>
        <p className="text-[10px] md:text-sm text-muted-foreground">
          ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}
