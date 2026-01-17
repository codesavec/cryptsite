import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCryptoPrice } from "@/lib/crypto-api"
import { CRYPTO_ASSETS } from "@/lib/constants"

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-user-id")

    const admin = await prisma.user.findUnique({
      where: { id: adminId || "" },
    })

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rates = await prisma.cryptoRate.findMany()
    return NextResponse.json(rates)
  } catch (error) {
    console.error("Admin rates fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 })
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

    const { symbol } = await request.json()
    const asset = CRYPTO_ASSETS[symbol as keyof typeof CRYPTO_ASSETS]

    if (!asset) {
      return NextResponse.json({ error: "Invalid symbol" }, { status: 400 })
    }

    console.log(`Admin fetching live price for: ${symbol} (${asset.coingeckoId})`)

    // Fetch fresh price from CoinGecko
    const freshPrice = await getCryptoPrice(asset.coingeckoId)

    if (freshPrice === null) {
      return NextResponse.json({ error: "Failed to fetch price from CoinGecko" }, { status: 502 })
    }

    // Update database
    const rate = await prisma.cryptoRate.upsert({
      where: { symbol },
      update: { price: freshPrice },
      create: { symbol, price: freshPrice },
    })

    return NextResponse.json(rate)
  } catch (error: any) {
    console.error("Admin rate update error:", error.message)
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 })
  }
}