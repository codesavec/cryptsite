import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

async function main() {
  console.log("Starting database seed...")

  // Create or update partners
  const partners = [
    {
      name: "Binance",
      logo: "https://en.wikipedia.org/wiki/File:Binance_logo.svg",
      url: "https://binance.com",
      order: 1,
    },
    {
      name: "Coinbase",
      logo: "https://en.wikipedia.org/wiki/File:Coinbase_logo.svg",
      url: "https://coinbase.com",
      order: 2,
    },
    {
      name: "Kraken",
      logo: "https://en.wikipedia.org/wiki/File:Kraken_logo.svg",
      url: "https://kraken.com",
      order: 3,
    },
    {
      name: "Bitfinex",
      logo: "https://en.wikipedia.org/wiki/File:Bitfinex_logo.svg",
      url: "https://bitfinex.com",
      order: 4,
    },
    {
      name: "OKEx",
      logo: "https://en.wikipedia.org/wiki/File:OKEx_logo.svg",
      url: "https://okex.com",
      order: 5,
    },
  ]

  for (const partner of partners) {
    await prisma.partner.upsert({
      where: { name: partner.name },
      update: { ...partner },
      create: { ...partner, isActive: true },
    })
  }

  console.log("Partners seeded successfully")

  // Create admin user if it doesn't exist
  const adminEmail = process.env.ADMIN_EMAIL || "admin1@cryptovault.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "changeMe123!"

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isVerified: true,
    },
  })

  console.log(`Admin user seeded: ${adminEmail}`)
  console.log("⚠️  IMPORTANT: Change the admin password immediately after first login!")

  // Create company metadata
  await prisma.company.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "CryptoVault",
      theme: "dark",
    },
  })

  console.log("Company metadata seeded")
  console.log("✅ Database seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
