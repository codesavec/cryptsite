import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const partners = await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(partners, { status: 200 })
  } catch (error) {
    console.error("Fetch partners error:", error)
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
  }
}
