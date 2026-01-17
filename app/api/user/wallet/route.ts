import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        btcBalance: true,
        ethBalance: true,
        ltcBalance: true,
        usdtBalance: true,
        totalDeposited: true,
        totalWithdrawn: true,
        totalProfits: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Wallet fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch wallet" }, { status: 500 })
  }
}
