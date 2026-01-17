import { type NextRequest, NextResponse } from "next/server"
import { CRYPTO_ASSETS } from "@/lib/constants"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Only fetch from database. No CoinGecko calls here.
    const dbRates = await prisma.cryptoRate.findMany()
    
    const result: any = {}
    
    // Map database results to the format the frontend expects (CoinGecko structure)
    Object.values(CRYPTO_ASSETS).forEach(asset => {
      const rate = dbRates.find(r => r.symbol === asset.symbol)
      // Use DB price or null if not set yet
      result[asset.coingeckoId] = { usd: rate ? rate.price : null }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in prices route:", error)
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 })
  }
}