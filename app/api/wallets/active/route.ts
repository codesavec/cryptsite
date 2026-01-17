import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const wallets = await prisma.adminWallet.findMany({
      where: { isEnabled: true },
    })

    const walletMap: Record<string, string> = {}
    wallets.forEach((w) => {
      walletMap[w.currency] = w.address
    })

    return NextResponse.json(walletMap)
  } catch (error) {
    console.error("Active wallets fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 })
  }
}
