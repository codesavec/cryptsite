"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CRYPTO_ASSETS } from "@/lib/constants"

interface CryptoRate {
  id: string
  symbol: string
  price: number
  updatedAt: string
}

export default function AdminRatesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [rates, setRates] = useState<Record<string, CryptoRate>>({})
  const [loading, setLoading] = useState(true)
  const [updatingSymbol, setUpdatingSymbol] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(storedUser)

    if (userData.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setUser(userData)
    fetchRates(userData.id)
  }, [router])

  const fetchRates = async (adminId: string) => {
    try {
      const response = await fetch("/api/admin/rates", {
        headers: { "x-user-id": adminId },
      })

      if (response.ok) {
        const data: CryptoRate[] = await response.json()
        const rateMap: Record<string, CryptoRate> = {}
        data.forEach(r => {
          rateMap[r.symbol] = r
        })
        setRates(rateMap)
      }
    } catch (error) {
      console.error("Error fetching rates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncPrice = async (symbol: string) => {
    setUpdatingSymbol(symbol)
    setMessage("")

    try {
      const response = await fetch("/api/admin/rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ symbol }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Successfully synced live price for ${symbol}`)
        fetchRates(user.id)
      } else {
        setMessage(data.error || "Failed to sync price")
      }
    } catch (error) {
      console.error("Error syncing rate:", error)
      setMessage("Error syncing rate")
    } finally {
      setUpdatingSymbol(null)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <SidebarNav isAdmin={true} className="hidden md:block" />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userEmail={user?.email} userName={user?.firstName} />

        <main className="flex-1 overflow-x-hidden p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Crypto Price Management</h1>
              <p className="text-sm text-muted-foreground mt-2">Sync live market prices from CoinGecko to your database</p>
            </div>

            {message && (
               <div className={`p-4 rounded-lg border text-sm ${message.includes("Successfully") ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                 {message}
               </div>
            )}

            <div className="grid gap-4 md:gap-6">
              {Object.entries(CRYPTO_ASSETS).map(([key, asset]) => {
                const currentRate = rates[key]
                const isUpdating = updatingSymbol === key
                
                return (
                  <Card key={key} className="bg-card border-border overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                      <div className="text-2xl sm:text-3xl">{asset.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                           <CardTitle className="text-accent text-base sm:text-lg">{asset.name} ({asset.symbol})</CardTitle>
                           {currentRate && (
                             <span className="text-[10px] text-muted-foreground italic">
                               Synced: {new Date(currentRate.updatedAt).toLocaleTimeString()}
                             </span>
                           )}
                        </div>
                        <CardDescription className="text-xs">Market price sync tool</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-center justify-between bg-secondary/30 p-4 sm:p-6 gap-4">
                      <div className="text-center sm:text-left">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">DB Rate (USD)</p>
                        <p className="text-2xl sm:text-3xl font-bold text-foreground">
                          {currentRate ? `$${currentRate.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "N/A"}
                        </p>
                      </div>
                      <Button 
                        onClick={() => handleSyncPrice(key)}
                        disabled={isUpdating}
                        className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground px-6 sm:px-8 py-3 sm:py-6 h-auto text-base sm:text-lg font-bold"
                      >
                        {isUpdating ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin h-4 w-4 border-2 border-accent-foreground border-t-transparent rounded-full"></span>
                            Syncing...
                          </span>
                        ) : "Update Price"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}