import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-user-id")
    const { userId, currency, amount, operation } = await request.json()

    // Verify admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!userId || !currency || amount === undefined || !operation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const balanceKey = `${currency.toLowerCase()}Balance` as "btcBalance" | "ethBalance" | "ltcBalance" | "usdtBalance"

    const incrementValue = operation === "add" ? amount : -amount

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        [balanceKey]: { increment: incrementValue },
      },
      select: {
        id: true,
        email: true,
        btcBalance: true,
        ethBalance: true,
        ltcBalance: true,
        usdtBalance: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Balance update error:", error)
    return NextResponse.json({ error: "Failed to update balance" }, { status: 500 })
  }
}
