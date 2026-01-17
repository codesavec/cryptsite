import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-user-id")

    // Verify admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      where: { role: "user" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        btcBalance: true,
        ethBalance: true,
        ltcBalance: true,
        usdtBalance: true,
        totalDeposited: true,
        totalWithdrawn: true,
        totalProfits: true,
        createdAt: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
