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

    const withdrawals = await prisma.withdrawal.findMany({
      where: { status: "pending" },
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(withdrawals)
  } catch (error) {
    console.error("Pending withdrawals fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 })
  }
}
