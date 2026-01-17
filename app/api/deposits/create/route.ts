import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCryptoPrice } from "@/lib/crypto-api"
import { CRYPTO_ASSETS } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { amount, currency } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 })
    }

    // Get current price
    const asset = CRYPTO_ASSETS[currency as keyof typeof CRYPTO_ASSETS]
    if (!asset) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }

    const price = await getCryptoPrice(asset.coingeckoId)
    const usdValue = price ? amount * price : 0

    // Create deposit
    const deposit = await prisma.deposit.create({
      data: {
        userId,
        amount,
        currency,
        usdValue,
        status: "pending",
      },
    })

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId,
        type: "deposit",
        amount,
        currency,
        description: `Deposit ${amount} ${currency}`,
      },
    })

    return NextResponse.json(deposit, { status: 201 })
  } catch (error) {
    console.error("Deposit creation error:", error)
    return NextResponse.json({ error: "Failed to create deposit" }, { status: 500 })
  }
}
