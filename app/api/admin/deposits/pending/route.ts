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

    const deposits = await prisma.deposit.findMany({
      where: { status: "pending" },
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(deposits)
  } catch (error) {
    console.error("Pending deposits fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch deposits" }, { status: 500 })
  }
}
