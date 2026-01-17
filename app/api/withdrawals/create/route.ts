import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCryptoPrice } from "@/lib/crypto-api"
import { CRYPTO_ASSETS } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { amount, currency, walletAddress } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!amount || !currency || !walletAddress) {
      return NextResponse.json({ error: "Amount, currency, and wallet address are required" }, { status: 400 })
    }

    // Get user and check balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const balanceKey = `${currency.toLowerCase()}Balance` as "btcBalance" | "ethBalance" | "ltcBalance" | "usdtBalance"
    const currentBalance = user[balanceKey]

    if (currentBalance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Get current price
    const asset = CRYPTO_ASSETS[currency as keyof typeof CRYPTO_ASSETS]
    if (!asset) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }

    const price = await getCryptoPrice(asset.coingeckoId)
    const usdValue = price ? amount * price : 0

    // Create withdrawal
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount,
        currency,
        usdValue,
        walletAddress,
        status: "pending",
      },
    })

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId,
        type: "withdrawal",
        amount,
        currency,
        description: `Withdrawal ${amount} ${currency} to ${walletAddress}`,
      },
    })

    return NextResponse.json(withdrawal, { status: 201 })
  } catch (error) {
    console.error("Withdrawal creation error:", error)
    return NextResponse.json({ error: "Failed to create withdrawal" }, { status: 500 })
  }
}
