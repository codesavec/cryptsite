import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-user-id")
    const { withdrawalId } = await request.json()

    // Verify admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get withdrawal
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { user: true },
    })

    if (!withdrawal) {
      return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 })
    }

    // Deduct balance
    const balanceKey = `${withdrawal.currency.toLowerCase()}Balance` as
      | "btcBalance"
      | "ethBalance"
      | "ltcBalance"
      | "usdtBalance"

    await prisma.user.update({
      where: { id: withdrawal.userId },
      data: {
        [balanceKey]: { decrement: withdrawal.amount },
        totalWithdrawn: { increment: withdrawal.usdValue },
      },
    })

    // Update withdrawal status
    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: "completed" },
    })

    return NextResponse.json(updatedWithdrawal)
  } catch (error) {
    console.error("Withdrawal approval error:", error)
    return NextResponse.json({ error: "Failed to approve withdrawal" }, { status: 500 })
  }
}
