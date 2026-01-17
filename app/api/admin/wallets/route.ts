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

    const wallets = await prisma.adminWallet.findMany({
      orderBy: { currency: "asc" },
    })

    return NextResponse.json(wallets)
  } catch (error) {
    console.error("Admin wallets fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-user-id")

    // Verify admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId || "" },
    })

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currency, address, isEnabled } = await request.json()

    if (!currency || !address) {
      return NextResponse.json({ error: "Currency and address are required" }, { status: 400 })
    }

    const wallet = await prisma.adminWallet.upsert({
      where: { currency },
      update: { address, isEnabled },
      create: { currency, address, isEnabled },
    })

    return NextResponse.json(wallet)
  } catch (error) {
    console.error("Admin wallet update error:", error)
    return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 })
  }
}
