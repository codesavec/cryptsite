"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { InvestmentPlans } from "@/components/investment-plans"

export default function PlansPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <SidebarNav className="hidden md:block" />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userEmail={user?.email} userName={user?.firstName} />

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Investment Plans</h1>
              <p className="text-sm md:text-muted-foreground mt-2">Explore our premium investment opportunities</p>
            </div>

            <InvestmentPlans />
          </div>
        </main>
      </div>
    </div>
  )
}
