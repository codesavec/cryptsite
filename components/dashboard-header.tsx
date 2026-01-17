"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { COMPANY_NAME } from "@/lib/constants"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SidebarNav } from "./sidebar-nav"

interface DashboardHeaderProps {
  userEmail?: string
  userName?: string
}

export function DashboardHeader({ userEmail, userName }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="bg-secondary border-b border-border sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-accent">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-sidebar border-r-border">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <SidebarNav isAdmin={isAdmin} className="w-full border-r-0" />
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="text-xl font-bold text-accent md:block hidden">{COMPANY_NAME}</div>
          <div className="text-xl font-bold text-accent md:hidden block">CV</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            {userName && <span className="text-sm font-semibold text-foreground">{userName}</span>}
            {userEmail && <span className="text-xs text-muted-foreground">{userEmail}</span>}
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
