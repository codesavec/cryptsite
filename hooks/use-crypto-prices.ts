"use client"

import { useState, useEffect, useCallback } from "react"

export function useCryptoPrices(refreshInterval = 30000) {
  const [prices, setPrices] = useState<Record<string, number | null>>({
    BTC: null,
    ETH: null,
    LTC: null,
    USDT: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = useCallback(async () => {
    try {
      const response = await fetch("/api/crypto/prices")
      if (!response.ok) throw new Error("Failed to fetch prices")

      const data = await response.json()
      const mappedPrices: Record<string, number | null> = {
        BTC: data.bitcoin?.usd || null,
        ETH: data.ethereum?.usd || null,
        LTC: data.litecoin?.usd || null,
        USDT: data.tether?.usd || null,
      }
      setPrices(mappedPrices)
      setError(null)
    } catch (err) {
      console.error("Error fetching prices:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch prices")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchPrices, refreshInterval])

  return { prices, loading, error, refetch: fetchPrices }
}
