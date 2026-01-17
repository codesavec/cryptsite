"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminTransactionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [deposits, setDeposits] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"deposits" | "withdrawals">("deposits")
  const [loading, setLoading] = useState(true)

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
    
    const fetchTransactions = async () => {
      try {
        const headers = { "x-user-id": userData.id }
        const [depositsRes, withdrawalsRes] = await Promise.all([
          fetch("/api/admin/deposits/pending", { headers }),
          fetch("/api/admin/withdrawals/pending", { headers })
        ])

        if (depositsRes.ok) {
          setDeposits(await depositsRes.json())
        }
        
        if (withdrawalsRes.ok) {
          setWithdrawals(await withdrawalsRes.json())
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [router])

  const handleApproveDeposit = async (depositId: string) => {
    try {
      await fetch("/api/deposits/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ depositId }),
      })

      setDeposits(deposits.filter((d) => d.id !== depositId))
    } catch (error) {
      console.error("Error approving deposit:", error)
    }
  }

  const handleApproveWithdrawal = async (withdrawalId: string) => {
    try {
      await fetch("/api/withdrawals/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ withdrawalId }),
      })

      setWithdrawals(withdrawals.filter((w) => w.id !== withdrawalId))
    } catch (error) {
      console.error("Error approving withdrawal:", error)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <SidebarNav isAdmin className="hidden md:block" />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userEmail={user?.email} userName={user?.firstName} />

        <main className="flex-1 overflow-x-hidden p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Transactions</h1>
              <p className="text-sm text-muted-foreground mt-2">Approve pending deposits and withdrawals</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("deposits")}
                className={`px-4 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
                  activeTab === "deposits" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setActiveTab("withdrawals")}
                className={`px-4 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
                  activeTab === "withdrawals" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"
                }`}
              >
                Withdrawals
              </button>
            </div>

            {/* Deposits Table */}
            {activeTab === "deposits" && (
              <Card className="bg-card border-border overflow-hidden">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-accent text-lg">Pending Deposits</CardTitle>
                  <CardDescription className="text-xs">Approve or reject user deposits</CardDescription>
                </CardHeader>

                <CardContent className="p-0 sm:p-6">
                  {deposits.length === 0 ? (
                    <p className="text-muted-foreground p-4 text-sm">No pending deposits</p>
                  ) : (
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-[10px] sm:text-sm whitespace-nowrap">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Currency</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">USD Value</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Date</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deposits.map((deposit) => (
                            <tr
                              key={deposit.id}
                              className="border-b border-border hover:bg-secondary/50 transition-colors"
                            >
                              <td className="py-3 px-4 text-foreground max-w-[120px] truncate">{deposit.user?.email}</td>
                              <td className="py-3 px-4 font-semibold text-foreground">{deposit.amount} {deposit.currency}</td>
                              <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{deposit.currency}</td>
                              <td className="py-3 px-4 text-accent font-bold">${deposit.usdValue.toFixed(2)}</td>
                              <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">
                                {new Date(deposit.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  onClick={() => handleApproveDeposit(deposit.id)}
                                  size="sm"
                                  className="h-7 px-3 text-[10px] bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Approve
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Withdrawals Table */}
            {activeTab === "withdrawals" && (
              <Card className="bg-card border-border overflow-hidden">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-accent text-lg">Pending Withdrawals</CardTitle>
                  <CardDescription className="text-xs">Approve or reject user withdrawals</CardDescription>
                </CardHeader>

                <CardContent className="p-0 sm:p-6">
                  {withdrawals.length === 0 ? (
                    <p className="text-muted-foreground p-4 text-sm">No pending withdrawals</p>
                  ) : (
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-[10px] sm:text-sm whitespace-nowrap">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">USD Value</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Wallet</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {withdrawals.map((withdrawal) => (
                            <tr
                              key={withdrawal.id}
                              className="border-b border-border hover:bg-secondary/50 transition-colors"
                            >
                              <td className="py-3 px-4 text-foreground max-w-[120px] truncate">{withdrawal.user?.email}</td>
                              <td className="py-3 px-4 font-semibold text-foreground">{withdrawal.amount} {withdrawal.currency}</td>
                              <td className="py-3 px-4 text-accent font-bold">${withdrawal.usdValue.toFixed(2)}</td>
                              <td className="py-3 px-4 text-muted-foreground text-[10px] max-w-[100px] truncate hidden sm:table-cell">
                                {withdrawal.walletAddress}
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  onClick={() => handleApproveWithdrawal(withdrawal.id)}
                                  size="sm"
                                  className="h-7 px-3 text-[10px] bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Approve
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
