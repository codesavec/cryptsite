import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-user-id")

    // Verify admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId || "" },
    })

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parallelize queries for performance
    const [
      userCount,
      depositStats,
      withdrawalStats,
      pendingDepositsCount,
      pendingWithdrawalsCount
    ] = await Promise.all([
      prisma.user.count({ where: { role: "user" } }),
      prisma.deposit.aggregate({
        where: { status: "approved" },
        _sum: { usdValue: true },
      }),
      prisma.withdrawal.aggregate({
        where: { status: "completed" },
        _sum: { usdValue: true },
      }),
      prisma.deposit.count({ where: { status: "pending" } }),
      prisma.withdrawal.count({ where: { status: "pending" } })
    ])

    const totalDeposits = depositStats._sum.usdValue || 0
    const totalWithdrawals = withdrawalStats._sum.usdValue || 0
    const totalRevenue = totalDeposits - totalWithdrawals

    return NextResponse.json({
      totalUsers: userCount,
      totalDeposits,
      totalWithdrawals,
      pendingDeposits: pendingDepositsCount,
      pendingWithdrawals: pendingWithdrawalsCount,
      totalRevenue
    })

  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
