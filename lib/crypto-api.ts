const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

export async function getCryptoPrices(cryptoIds: string[]): Promise<Record<string, number>> {
  try {
    const ids = cryptoIds.join(",")
    const response = await fetch(`${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd`)

    if (!response.ok) {
      throw new Error("Failed to fetch prices")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching crypto prices:", error)
    return {}
  }
}

export async function getCryptoPrice(cryptoId: string): Promise<number | null> {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/simple/price?ids=${cryptoId}&vs_currencies=usd`)

    if (!response.ok) {
      throw new Error("Failed to fetch price")
    }

    const data = await response.json()
    return data[cryptoId]?.usd || null
  } catch (error) {
    console.error("Error fetching crypto price:", error)
    return null
  }
}
