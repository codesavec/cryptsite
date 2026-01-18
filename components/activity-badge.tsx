"use client"

interface ActivityBadgeProps {
  type: "deposit" | "withdrawal" | "profit"
  amount: number
  currency: string
}

export function ActivityBadge({ type, amount, currency }: ActivityBadgeProps) {
  const getColor = () => {
    switch (type) {
      case "deposit":
        return "bg-green-500/20 text-green-500 border-green-500/50"
      case "withdrawal":
        return "bg-accent/20 text-accent border-accent/50"
      case "profit":
        return "bg-accent/20 text-accent border-accent/50"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "deposit":
        return "💰"
      case "withdrawal":
        return "🏦"
      case "profit":
        return "📈"
      default:
        return "📊"
    }
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded border text-xs font-medium ${getColor()}`}>
      <span>{getIcon()}</span>
      <span>
        {type.charAt(0).toUpperCase() + type.slice(1)}: {amount} {currency}
      </span>
    </div>
  )
}
