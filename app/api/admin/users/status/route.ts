import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-user-id")
    const { userId, isActive } = await request.json()

    if (!adminId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId || "" },
    })

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    })

    return NextResponse.json({ 
      success: true, 
      userId: updatedUser.id, 
      isActive: updatedUser.isActive 
    })
  } catch (error) {
    console.error("User status update error:", error)
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}
