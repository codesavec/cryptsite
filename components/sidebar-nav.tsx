"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  isAdmin?: boolean
  className?: string
}

export function SidebarNav({ isAdmin = false, className }: SidebarNavProps) {
  const pathname = usePathname()
  
  // ... (links definitions same as before)
  const userLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/plans", label: "Plans", icon: "🎯" },
    { href: "/dashboard/deposit", label: "Deposit", icon: "💰" },
    { href: "/dashboard/withdraw", label: "Withdraw", icon: "🏦" },
    { href: "/dashboard/transactions", label: "Transactions", icon: "📝" },
  ]

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/transactions", label: "Transactions", icon: "📝" },
    { href: "/admin/wallets", label: "Wallets", icon: "💼" },
    { href: "/admin/rates", label: "Rates", icon: "📈" },
  ]

  const links = isAdmin ? adminLinks : userLinks

  return (
    <nav className={cn("bg-sidebar border-r border-sidebar-border min-h-screen w-64 space-y-1 p-4", className)}>
      <div className="mb-8 px-4 py-2">
        <span className="text-xl font-bold text-accent">CryptoVault</span>
      </div>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center px-4 py-3 rounded-lg transition-all text-sm font-medium mb-1",
            pathname === link.href
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/20",
          )}
        >
          <span className="mr-3 text-lg">{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
