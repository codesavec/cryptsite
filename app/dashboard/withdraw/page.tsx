"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CRYPTO_ASSETS } from "@/lib/constants"

export default function WithdrawPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [amount, setAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [price, setPrice] = useState<number | null>(null)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)

    // Fetch wallet data and prices
    const fetchData = async () => {
      try {
        const [walletRes, pricesRes] = await Promise.all([
          fetch("/api/user/wallet", {
            headers: { "x-user-id": userData.id },
          }),
          fetch("/api/crypto/prices"),
        ])

        if (walletRes.ok) {
          const walletData = await walletRes.json()
          const balanceKey = `${selectedCrypto.toLowerCase()}Balance` as
            | "btcBalance"
            | "ethBalance"
            | "ltcBalance"
            | "usdtBalance"
          setBalance(walletData[balanceKey] || 0)
        }

        if (pricesRes.ok) {
          const prices = await pricesRes.json()
          const asset = CRYPTO_ASSETS[selectedCrypto as keyof typeof CRYPTO_ASSETS]
          const cryptoPrice = prices[asset.coingeckoId]?.usd || null
          setPrice(cryptoPrice)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [router, selectedCrypto])

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/withdrawals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          currency: selectedCrypto,
          walletAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Withdrawal creation failed")
        return
      }

      setSuccess(`Withdrawal of ${amount} ${selectedCrypto} created successfully! Pending admin approval.`)
      setAmount("")
      setWalletAddress("")

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const usdValue = amount && price ? (Number.parseFloat(amount) * price).toFixed(2) : "0.00"

  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col">
        <DashboardHeader userEmail={user?.email} />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Withdraw Funds</h1>
              <p className="text-muted-foreground mt-2">Transfer your cryptocurrency to your wallet</p>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-accent">Withdrawal Details</CardTitle>
                <CardDescription>Enter the amount and destination wallet address</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleWithdraw} className="space-y-6">
                  {error && (
                    <div className="bg-destructive/20 border border-destructive text-destructive p-4 rounded">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-500/20 border border-green-500 text-green-500 p-4 rounded animate-pulse-gold">
                      {success}
                    </div>
                  )}

                  {/* Cryptocurrency Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-4">Select Cryptocurrency</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(CRYPTO_ASSETS).map(([key, asset]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedCrypto(key)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedCrypto === key
                              ? "border-accent bg-accent/10"
                              : "border-border bg-secondary hover:border-accent"
                          }`}
                        >
                          <div className="text-2xl mb-2">{asset.icon}</div>
                          <p className="font-semibold text-foreground">{asset.symbol}</p>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Available Balance */}
                  <div className="bg-secondary border border-border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Available Balance</span>
                      <span className="font-bold text-accent">
                        {balance.toFixed(8)} {selectedCrypto}
                      </span>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Amount ({selectedCrypto})</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.00000001"
                      min="0"
                      max={balance}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                      required
                    />
                    {price && amount && <p className="text-sm text-accent mt-2">≈ ${usdValue} USD</p>}
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Wallet Address</label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter destination wallet address"
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  {/* Max Button */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setAmount(balance.toString())}
                      className="text-sm text-accent hover:underline"
                    >
                      Withdraw Max ({balance.toFixed(8)} {selectedCrypto})
                    </button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading || !amount || !walletAddress}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base"
                  >
                    {loading ? "Processing..." : `Withdraw ${amount || "0"} ${selectedCrypto}`}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-secondary border-border mt-6">
              <CardHeader>
                <CardTitle className="text-sm text-accent">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• All withdrawals require admin approval</p>
                <p>• Double-check your wallet address before confirming</p>
                <p>• Withdrawals are final and cannot be reversed</p>
                <p>• Processing times depend on network confirmation</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
