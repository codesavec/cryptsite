"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CRYPTO_ASSETS } from "@/lib/constants"

interface AdminWallet {
  id: string
  currency: string
  address: string
  isEnabled: boolean
}

export default function AdminWalletsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [wallets, setWallets] = useState<Record<string, AdminWallet>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    fetchWallets(userData.id)
  }, [router])

  const fetchWallets = async (adminId: string) => {
    try {
      const response = await fetch("/api/admin/wallets", {
        headers: { "x-user-id": adminId },
      })

      if (response.ok) {
        const data: AdminWallet[] = await response.json()
        const walletMap: Record<string, AdminWallet> = {}
        data.forEach(w => {
          walletMap[w.currency] = w
        })
        setWallets(walletMap)
      }
    } catch (error) {
      console.error("Error fetching wallets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateWallet = async (currency: string, address: string) => {
    setSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/wallets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          currency,
          address,
          isEnabled: true
        }),
      })

      if (response.ok) {
        setMessage(`Wallet for ${currency} updated successfully`)
        fetchWallets(user.id)
      } else {
        setMessage("Failed to update wallet")
      }
    } catch (error) {
      console.error("Error updating wallet:", error)
      setMessage("Error updating wallet")
    } finally {
      setSaving(false)
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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Wallets</h1>
              <p className="text-sm text-muted-foreground mt-2">Set up destination addresses for user deposits</p>
            </div>

            {message && (
               <div className="p-3 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 text-sm">
                 {message}
               </div>
            )}

            <div className="grid gap-4 md:gap-6">
              {Object.entries(CRYPTO_ASSETS).map(([key, asset]) => {
                const currentWallet = wallets[key]
                return (
                  <Card key={key} className="bg-card border-border overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                      <div className="text-2xl sm:text-3xl">{asset.icon}</div>
                      <div>
                        <CardTitle className="text-accent text-base sm:text-lg">{asset.name} ({asset.symbol})</CardTitle>
                        <CardDescription className="text-xs">Enter your {asset.name} wallet address</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          const form = e.target as HTMLFormElement
                          const address = (form.elements.namedItem("address") as HTMLInputElement).value
                          handleUpdateWallet(key, address)
                        }}
                        className="flex flex-col sm:flex-row gap-3"
                      >
                        <input
                          name="address"
                          defaultValue={currentWallet?.address || ""}
                          placeholder={`Enter ${asset.symbol} address`}
                          className="flex-1 px-4 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:border-accent text-sm font-mono"
                        />
                        <Button 
                          type="submit" 
                          disabled={saving}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground py-2 h-auto"
                        >
                          Save
                        </Button>
                      </form>
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
