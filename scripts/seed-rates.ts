import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"
import path from "path"

const envPath = path.resolve(__dirname, "../.env")
dotenv.config({ path: envPath })

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding crypto rates...")

  const initialRates = [
    { symbol: "BTC", price: 65000 },
    { symbol: "ETH", price: 3500 },
    { symbol: "LTC", price: 85 },
    { symbol: "USDT", price: 1 },
  ]

  for (const rate of initialRates) {
    await prisma.cryptoRate.upsert({
      where: { symbol: rate.symbol },
      update: { price: rate.price },
      create: { symbol: rate.symbol, price: rate.price },
    })
  }

  console.log("Crypto rates seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
