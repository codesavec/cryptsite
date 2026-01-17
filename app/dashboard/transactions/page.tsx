"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransactionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)

    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions", {
          headers: { "x-user-id": userData.id },
        })

        if (response.ok) {
          const data = await response.json()
          setTransactions(data)
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [router])

  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col">
        <DashboardHeader userEmail={user?.email} />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
              <p className="text-muted-foreground mt-2">View all your deposits, withdrawals, and transactions</p>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-accent">Your Transactions</CardTitle>
                <CardDescription>All transactions are listed in reverse chronological order</CardDescription>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                  <p className="text-muted-foreground">No transactions yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Currency</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Description</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                            <td className="py-3 px-4">
                              <span className="capitalize inline-block px-3 py-1 rounded bg-accent/10 text-accent text-xs font-medium">
                                {tx.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-foreground">{tx.amount}</td>
                            <td className="py-3 px-4 text-muted-foreground">{tx.currency}</td>
                            <td className="py-3 px-4 text-muted-foreground">{tx.description}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(tx.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
