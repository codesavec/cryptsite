"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CRYPTO_ASSETS } from "@/lib/constants"

export default function DepositPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState<number | null>(null)
  const [wallets, setWallets] = useState<Record<string, string>>({})
  const [confirmed, setConfirmed] = useState(false)
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

    // Fetch active wallets
    fetch("/api/wallets/active")
      .then(res => res.json())
      .then(data => setWallets(data))
      .catch(err => console.error("Error fetching wallets:", err))

    // Fetch price for selected crypto
    const fetchPrice = async () => {
      const asset = CRYPTO_ASSETS[selectedCrypto as keyof typeof CRYPTO_ASSETS]
      if (asset) {
        try {
          const response = await fetch("/api/crypto/prices")
          const prices = await response.json()
          const cryptoPrice = prices[asset.coingeckoId]?.usd || null
          setPrice(cryptoPrice)
        } catch (err) {
          console.error("Error fetching price:", err)
        }
      }
    }

    fetchPrice()
  }, [router, selectedCrypto])

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/deposits/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          currency: selectedCrypto,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Deposit creation failed")
        return
      }

      setSuccess(`Deposit of ${amount} ${selectedCrypto} created successfully! Pending admin approval.`)
      setAmount("")

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
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <SidebarNav className="hidden md:block" />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userEmail={user?.email} userName={user?.firstName} />

        <main className="flex-1 overflow-x-hidden p-4 md:p-6">
          <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="mb-6 md:mb-8 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Make a Deposit</h1>
              <p className="text-sm md:text-muted-foreground mt-2">Add funds to your account securely</p>
            </div>

            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-accent text-lg">Deposit Details</CardTitle>
                <CardDescription className="text-xs md:text-sm">Select your preferred cryptocurrency and amount</CardDescription>
              </CardHeader>

              <CardContent className="p-4 md:p-6">
                <form onSubmit={handleDeposit} className="space-y-6">
                  {error && (
                    <div className="bg-destructive/20 border border-destructive text-destructive p-3 text-sm rounded">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-500/20 border border-green-500 text-green-500 p-3 text-sm rounded animate-pulse-gold">
                      {success}
                    </div>
                  )}

                  {/* Cryptocurrency Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-4">Select Cryptocurrency</label>
                    <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-3">
                      {Object.entries(CRYPTO_ASSETS).map(([key, asset]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedCrypto(key)}
                          className={`p-3 sm:p-4 rounded-lg border-2 transition-all flex flex-col items-center text-center ${
                            selectedCrypto === key
                              ? "border-accent bg-accent/10"
                              : "border-border bg-secondary hover:border-accent"
                          }`}
                        >
                          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{asset.icon}</div>
                          <p className="font-semibold text-foreground text-xs sm:text-sm">{asset.symbol}</p>
                          <p className="text-[10px] text-muted-foreground hidden sm:block">{asset.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Amount ({selectedCrypto})</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.00000001"
                        min="0"
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent text-lg font-mono"
                        required
                      />
                    </div>
                    {price && amount && <p className="text-xs sm:text-sm text-accent mt-2 font-medium">≈ ${usdValue} USD</p>}
                  </div>

                  {/* Payment Details */}
                  <div className="bg-secondary/30 border border-border p-4 sm:p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold text-accent text-sm sm:text-base">Payment Details</h3>
                    
                    {wallets[selectedCrypto] ? (
                      <div className="space-y-3">
                        <p className="text-[10px] sm:text-sm text-muted-foreground italic">Send {selectedCrypto} to the address below:</p>
                        <div className="p-3 bg-background border border-border rounded font-mono text-[10px] sm:text-xs break-all flex items-start gap-2 relative group">
                          <span className="flex-1">{wallets[selectedCrypto]}</span>
                          <Button 
                            type="button"
                            variant="secondary" 
                            size="sm"
                            onClick={() => {
                                navigator.clipboard.writeText(wallets[selectedCrypto]);
                                // Optional: add toast or feedback
                            }}
                            className="h-6 px-2 text-[10px]"
                          >
                            Copy
                          </Button>
                        </div>
                        <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                          <p className="text-[10px] text-yellow-500 leading-tight">
                            ⚠️ ONLY SEND {selectedCrypto.toUpperCase()} TO THIS ADDRESS.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-destructive text-xs sm:text-sm p-3 bg-destructive/10 rounded">
                         Wallet address not configured. Please contact support.
                      </div>
                    )}
                  </div>

                  {/* Confirmation */}
                  <div className="flex items-start gap-3 p-3 bg-accent/5 rounded-lg border border-accent/10">
                     <div className="flex items-center h-5">
                       <input
                         type="checkbox"
                         id="confirmed"
                         checked={confirmed}
                         onChange={(e) => setConfirmed(e.target.checked)}
                         className="h-4 w-4 rounded border-border text-accent focus:ring-accent bg-background"
                       />
                     </div>
                     <label htmlFor="confirmed" className="text-xs text-muted-foreground leading-snug cursor-pointer select-none">
                       I have sent the payment and understand it requires manual approval.
                     </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading || !amount || !confirmed || !wallets[selectedCrypto]}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-4 h-auto text-lg font-bold shadow-lg shadow-accent/20"
                  >
                    {loading ? "Processing..." : `I Have Sent ${amount || "0"} ${selectedCrypto}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>

)
}
