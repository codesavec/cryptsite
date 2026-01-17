import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-user-id")
    const { depositId } = await request.json()

    // Verify admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get deposit
    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId },
      include: { user: true },
    })

    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 })
    }

    // Update deposit status
    const updatedDeposit = await prisma.deposit.update({
      where: { id: depositId },
      data: { status: "approved" },
    })

    // Update user balance based on currency
    const balanceKey = `${deposit.currency.toLowerCase()}Balance` as
      | "btcBalance"
      | "ethBalance"
      | "ltcBalance"
      | "usdtBalance"

    await prisma.user.update({
      where: { id: deposit.userId },
      data: {
        [balanceKey]: { increment: deposit.amount },
        totalDeposited: { increment: deposit.usdValue },
      },
    })

    return NextResponse.json(updatedDeposit)
  } catch (error) {
    console.error("Deposit approval error:", error)
    return NextResponse.json({ error: "Failed to approve deposit" }, { status: 500 })
  }
}
