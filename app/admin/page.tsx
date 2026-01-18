"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AdminStats {
  totalUsers: number
  totalDeposits: number
  totalWithdrawals: number
  pendingDeposits: number
  pendingWithdrawals: number
  totalRevenue: number
}

interface User {
  id: string
  email: string
  firstName: string
  btcBalance: number
  ethBalance: number
  ltcBalance: number
  usdtBalance: number
  totalDeposited: number
  totalProfits: number
  totalWithdrawn: number
  isActive: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalRevenue: 0,
  })
  const [users, setUsers] = useState<User[]>([])
  const [cryptoPrices, setCryptoPrices] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Balance Update Modal State
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [updateModal, setUpdateModal] = useState(false)
  const [updateForm, setUpdateForm] = useState({ currency: "BTC", amount: "", operation: "add" })

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
    fetchAdminData(userData.id)
  }, [router])

  const fetchAdminData = async (adminId: string) => {
    try {
      const headers = { "x-user-id": adminId }
      
      const [usersRes, statsRes, pricesRes] = await Promise.all([
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/stats", { headers }),
        fetch("/api/crypto/prices")
      ])

      if (usersRes.ok) {
        const allUsers = await usersRes.json()
        setUsers(allUsers)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
      
      if (pricesRes.ok) {
        const prices = await pricesRes.json()
        const mappedPrices: Record<string, number | null> = {
          BTC: prices.bitcoin?.usd || 0,
          ETH: prices.ethereum?.usd || 0,
          LTC: prices.litecoin?.usd || 0,
          USDT: prices.tether?.usd || 0,
        }
        setCryptoPrices(mappedPrices)
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/admin/balance/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          currency: updateForm.currency,
          amount: Number.parseFloat(updateForm.amount),
          operation: updateForm.operation,
        }),
      })

      if (response.ok) {
        setUpdateModal(false)
        setUpdateForm({ currency: "BTC", amount: "", operation: "add" })
        fetchAdminData(user.id)
      }
    } catch (error) {
      console.error("Error updating balance:", error)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/users/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          userId,
          isActive: !currentStatus,
        }),
      })

      if (response.ok) {
        fetchAdminData(user.id)
      }
    } catch (error) {
      console.error("Error toggling user status:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <SidebarNav isAdmin={true} className="hidden md:block" />

      <main className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userName={user?.firstName || "Admin"} userEmail={user?.email} />

        <div className="p-4 md:p-8 overflow-x-hidden">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-accent">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border-accent/20">
              <CardHeader className="pb-3 px-4 pt-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Users</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl md:text-3xl font-bold text-accent">{stats.totalUsers}</div>
                <p className="text-[10px] text-muted-foreground mt-1">Active users</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-accent/20">
              <CardHeader className="pb-3 px-4 pt-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Deposits</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl md:text-3xl font-bold text-green-400">${stats.totalDeposits.toLocaleString()}</div>
                <p className="text-[10px] text-muted-foreground mt-1">Cumulative deposits</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-accent/20">
              <CardHeader className="pb-3 px-4 pt-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl md:text-3xl font-bold text-accent">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-[10px] text-muted-foreground mt-1">Deposits - Withdrawals</p>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="bg-card border-accent/20 overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Recent Users</CardTitle>
              <CardDescription className="text-xs">Manage user accounts and balances</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-[10px] sm:text-sm whitespace-nowrap">
                  <thead className="border-b border-accent/20">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-accent">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-accent">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-accent hidden sm:table-cell">Deposited</th>
                      <th className="text-left py-3 px-4 font-semibold text-accent">Balance</th>
                      <th className="text-left py-3 px-4 font-semibold text-accent">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-accent">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-accent/10 hover:bg-accent/5">
                        <td className="py-3 px-4 font-medium">{u.firstName}</td>
                        <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4 text-green-400 hidden sm:table-cell">${u.totalDeposited.toLocaleString()}</td>
                        <td className="py-3 px-4 font-bold text-accent">
                          {cryptoPrices ? (
                            (
                              u.btcBalance * (cryptoPrices.BTC || 0) +
                              u.ethBalance * (cryptoPrices.ETH || 0) +
                              u.ltcBalance * (cryptoPrices.LTC || 0) +
                              u.usdtBalance * (cryptoPrices.USDT || 0)
                            ).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
                          ) : (
                            "..."
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider ${u.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <Button
                              onClick={() => {
                                setSelectedUser(u)
                                setUpdateModal(true)
                              }}
                              size="sm"
                              className="h-7 px-3 text-[10px] bg-accent hover:bg-accent/90 text-accent-foreground"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => toggleUserStatus(u.id, u.isActive)}
                              size="sm"
                              variant="outline"
                              className={`h-7 px-3 text-[10px] border-border ${u.isActive ? "hover:bg-red-500/10 text-red-500" : "hover:bg-green-500/10 text-green-500"}`}
                            >
                              {u.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Update Balance Modal */}
          {updateModal && selectedUser && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <Card className="bg-card border-border w-full max-w-md animate-in fade-in zoom-in duration-200">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-accent text-lg">Update Balance</CardTitle>
                  <CardDescription className="text-xs truncate">{selectedUser.email}</CardDescription>
                </CardHeader>

                <CardContent className="p-4 md:p-6">
                  <form onSubmit={handleUpdateBalance} className="space-y-4">
                    {/* Currency Selection */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Asset</label>
                      <select
                        value={updateForm.currency}
                        onChange={(e) => setUpdateForm({ ...updateForm, currency: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm focus:outline-none focus:border-accent"
                      >
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="LTC">Litecoin (LTC)</option>
                        <option value="USDT">Tether (USDT)</option>
                      </select>
                    </div>

                    {/* Operation */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Action</label>
                      <select
                        value={updateForm.operation}
                        onChange={(e) => setUpdateForm({ ...updateForm, operation: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm focus:outline-none focus:border-accent"
                      >
                        <option value="add">Add Funds</option>
                        <option value="reduce">Remove Funds</option>
                      </select>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Amount</label>
                      <input
                        type="number"
                        value={updateForm.amount}
                        onChange={(e) => setUpdateForm({ ...updateForm, amount: e.target.value })}
                        placeholder="0.00"
                        step="0.00000001"
                        min="0"
                        className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm focus:outline-none focus:border-accent font-mono"
                        required
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground py-2 h-auto font-bold">
                        Confirm
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setUpdateModal(false)}
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:bg-secondary py-2 h-auto"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
