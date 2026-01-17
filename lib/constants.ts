// Single point of truth for company name and configuration
export const COMPANY_NAME = "TradingCrypt"
export const COMPANY_LOGO = "₿"; // Placeholder

export const CRYPTO_ASSETS = {
  BTC: {
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    coingeckoId: "bitcoin",
    color: "#F7931A",
  },
  ETH: {
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    coingeckoId: "ethereum",
    color: "#627EEA",
  },
  LTC: {
    name: "Litecoin",
    symbol: "LTC",
    icon: "Ł",
    coingeckoId: "litecoin",
    color: "#345D9D",
  },
  USDT: {
    name: "Tether",
    symbol: "USDT",
    icon: "$",
    coingeckoId: "tether",
    color: "#26A17B",
  },
}

export const INVESTMENT_PLANS = [
  {
    id: "starter",
    name: "STARTER PLAN",
    returnPercentage: 200,
    durationDays: 7,
    minAmount: 1000,
    maxAmount: 50000,
    referralPercentage: 5,
    principalIncluded: true,
    paymentsInstant: true,
    onlineSupport: true,
  },
  {
    id: "silver",
    name: "SILVER PLAN",
    returnPercentage: 500,
    durationDays: 14,
    minAmount: 10000,
    maxAmount: 500000,
    referralPercentage: 5,
    principalIncluded: true,
    paymentsInstant: true,
    onlineSupport: true,
  },
  {
    id: "gold",
    name: "GOLD PLAN",
    returnPercentage: 1000,
    durationDays: 30,
    minAmount: 15000,
    maxAmount: 5000000,
    referralPercentage: 5,
    principalIncluded: true,
    paymentsInstant: true,
    onlineSupport: true,
  },
]
