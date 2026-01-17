"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminUsersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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
    fetchUsers(userData.id)
  }, [router])

  const fetchUsers = async (adminId: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        headers: { "x-user-id": adminId },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
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
        fetchUsers(user.id)
      }
    } catch (error) {
      console.error("Error updating balance:", error)
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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Users</h1>
              <p className="text-sm text-muted-foreground mt-2">View all users and manage their balances</p>
            </div>

            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-accent text-lg">All Users</CardTitle>
                <CardDescription className="text-xs">Click on a user to manage their balance</CardDescription>
              </CardHeader>

              <CardContent className="p-0 sm:p-6">
                {loading ? (
                  <p className="text-muted-foreground p-4">Loading users...</p>
                ) : users.length === 0 ? (
                  <p className="text-muted-foreground p-4">No users found</p>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-[10px] sm:text-sm whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">BTC</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">ETH</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">USDT</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Total Dep.</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                            <td className="py-3 px-4 text-foreground">{u.email}</td>
                            <td className="py-3 px-4 text-foreground">
                              {u.firstName} {u.lastName}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{u.btcBalance.toFixed(8)}</td>
                            <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{u.ethBalance.toFixed(8)}</td>
                            <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{u.usdtBalance.toFixed(2)}</td>
                            <td className="py-3 px-4 text-accent font-bold">${u.totalDeposited.toFixed(2)}</td>
                            <td className="py-3 px-4">
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
    </div>
  )
}
