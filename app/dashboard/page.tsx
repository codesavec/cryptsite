"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WalletOverview } from "@/components/wallet-overview"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { PriceChartWidget } from "@/components/price-chart-widget"
import { CryptoConverter } from "@/components/crypto-converter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCryptoPrices } from "@/hooks/use-crypto-prices"

export default function DashboardPage() {
  const router = useRouter()
  const { prices: cryptoPrices } = useCryptoPrices()
  const [user, setUser] = useState<any>(null)
  const [walletData, setWalletData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)

    const fetchData = async () => {
      try {
        const [walletRes, transactionsRes] = await Promise.all([
          fetch("/api/user/wallet", {
            headers: { "x-user-id": userData.id },
          }),
          fetch("/api/transactions", {
            headers: { "x-user-id": userData.id },
          }),
        ])

        if (walletRes.ok) {
          setWalletData(await walletRes.json())
        }

        if (transactionsRes.ok) {
          const transactions = await transactionsRes.json()
          setRecentActivity(transactions.slice(0, 10))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const totalBalance = walletData && cryptoPrices ? 
    (walletData.btcBalance * (cryptoPrices.BTC || 0)) +
    (walletData.ethBalance * (cryptoPrices.ETH || 0)) +
    (walletData.ltcBalance * (cryptoPrices.LTC || 0)) +
    (walletData.usdtBalance * (cryptoPrices.USDT || 0))
    : 0

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <SidebarNav className="hidden md:block" />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userEmail={user?.email} userName={user?.firstName} />

        <main className="flex-1 overflow-x-hidden p-4 md:p-8 bg-gradient-to-b from-secondary/30 to-background">
          <div className="max-w-7xl mx-auto space-y-6 md:y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1">Dashboard Overview</h1>
                <p className="text-muted-foreground text-sm md:text-lg">Welcome back, {user?.firstName || "Trader"}</p>
              </div>
              <div className="hidden md:block p-4 bg-card border border-border rounded-lg">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold text-accent">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            {walletData && cryptoPrices && <WalletOverview walletData={walletData} cryptoPrices={cryptoPrices} />}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Balance Chart & Summary */}
              <Card className="lg:col-span-2 bg-card border-border hover:border-accent/50 transition-all overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-accent">Balance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-[10px] md:text-xs text-muted-foreground mb-1">TOTAL BALANCE</p>
                      <p className="text-lg md:text-2xl font-bold text-accent">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Deposited</p>
                      <p className="text-lg md:text-2xl font-bold text-foreground">${walletData.totalDeposited.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Profits</p>
                      <p className={`text-lg md:text-2xl font-bold ${totalBalance - walletData.totalDeposited >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ${(totalBalance - walletData.totalDeposited).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card border-border hover:border-accent/50 transition-all flex flex-col">
                <CardHeader>
                  <CardTitle className="text-accent text-center text-sm md:text-base">QUICK ACTIONS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col justify-center">
                  <Button
                    onClick={() => router.push("/dashboard/deposit")}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 h-auto"
                  >
                    💰 Make Deposit
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard/withdraw")}
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent/10 font-semibold py-2 h-auto"
                  >
                    🏦 Withdraw Funds
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard/transactions")}
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent/10 font-semibold py-2 h-auto"
                  >
                    📝 Transaction History
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Crypto Table */}
            <Card className="bg-card border-border overflow-hidden">
              <CardHeader>
                <CardTitle className="text-accent text-lg">Crypto Assets Details</CardTitle>
                <CardDescription className="text-xs">Your holdings and USD conversion</CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-[10px] sm:text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 sm:px-4 text-accent font-semibold">Asset</th>
                        <th className="text-right py-3 px-2 sm:px-4 text-accent font-semibold">Balance</th>
                        <th className="text-right py-3 px-2 sm:px-4 text-accent font-semibold">USD Value</th>
                        <th className="text-right py-3 px-2 sm:px-4 text-accent font-semibold hidden sm:table-cell">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { symbol: "BTC", name: "Bitcoin", key: "btcBalance" },
                        { symbol: "ETH", name: "Ethereum", key: "ethBalance" },
                        { symbol: "LTC", name: "Litecoin", key: "ltcBalance" },
                        { symbol: "USDT", name: "Tether", key: "usdtBalance" },
                      ].map((crypto, idx) => {
                        const balance = walletData[crypto.key as keyof typeof walletData] || 0
                        const price = cryptoPrices?.[crypto.symbol] || 0
                        const value = balance * price
                        return (
                          <tr key={idx} className="border-b border-border/50 hover:bg-secondary/50 transition">
                            <td className="py-3 px-2 sm:px-4">
                               <div className="font-semibold text-foreground">{crypto.symbol}</div>
                               <div className="text-[8px] sm:text-xs text-muted-foreground hidden xs:block">{crypto.name}</div>
                            </td>
                            <td className="py-3 px-2 sm:px-4 text-right text-foreground">
                              {balance.toFixed(crypto.symbol === "USDT" ? 2 : 6)}
                            </td>
                            <td className="py-3 px-2 sm:px-4 text-right text-accent font-semibold">
                              ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-2 sm:px-4 text-right text-muted-foreground hidden sm:table-cell">
                              ${price.toLocaleString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Activity and Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-card border-border overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-accent text-lg">Recent Activity</CardTitle>
                  <CardDescription className="text-xs">Your latest transactions</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((tx, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50 hover:border-accent/30 transition"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground text-sm capitalize truncate">{tx.type}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className={`font-bold text-sm ml-4 whitespace-nowrap ${tx.type === "deposit" ? "text-green-500" : "text-red-500"}`}>
                            {tx.type === "deposit" ? "+" : "-"}
                            {tx.amount} {tx.currency}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card className="bg-card border-border overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-accent text-lg">Performance</CardTitle>
                  <CardDescription className="text-xs">Your investment metrics</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase">Withdrawn</p>
                      <p className="text-base sm:text-xl font-bold text-foreground">${walletData.totalWithdrawn.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase">Active Deposits</p>
                      <p className="text-base sm:text-xl font-bold text-accent">${walletData.totalDeposited.toFixed(2)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/dashboard/plans")}
                    className="w-full bg-accent hover:bg-accent/90 py-2 h-auto"
                  >
                    View Investment Plans
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PriceChartWidget prices={cryptoPrices} />
              <CryptoConverter prices={cryptoPrices} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
