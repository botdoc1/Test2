"use client"

import { useState } from "react"

// Простой in-memory кэш и дедупликация запросов для ускорения ответов на клиенте.
// Кэш хранится на уровне модуля, чтобы переживать перерендеры хука.
const CACHE_TTL_MS = 1000 * 60 * 5 // 5 минут
const detailsCache = new Map<string, { ts: number; data: any }>()
const episodesCache = new Map<string, { ts: number; data: any }>()
const searchCache = new Map<string, { ts: number; data: any }>()
const inflight = new Map<string, Promise<any>>()

export interface AnimeData {
  id: number
  title: string
  titleEnglish?: string
  titleJapanese?: string
  synopsis: string
  image: string
  score: number
  episodes: number
  status: string
  year: number
  genres: string[]
  studios: string[]
  availableDubs: DubInfo[]
  trailer?: string
  // optional fields for UI components compatibility
  originalTitle?: string
  rating?: number
  duration?: string
  studio?: string
  description?: string
  poster?: string
}

export interface DubInfo {
  provider: string
  quality: string[]
  episodes: { [key: string]: any }
  description?: string
  logo?: string
}

export interface SearchFilters {
  query?: string
  genre?: string
  year?: string
  status?: string
  page?: number
  limit?: number
}

export function useAnime() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchAnime = async (filters: SearchFilters = {}) => {
    setLoading(true)
    setError(null)

    try {
      // Создаём ключ по фильтрам
      const key = JSON.stringify(filters || {})
      const cached = searchCache.get(key)
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
        return cached.data
      }

      if (inflight.has(key)) {
        return await inflight.get(key)
      }

      const params = new URLSearchParams()
      if (filters.query) params.set("q", filters.query)
      if (filters.genre) params.set("genre", filters.genre)
      if (filters.year) params.set("year", filters.year)
      if (filters.status) params.set("status", filters.status)
      if (filters.page) params.set("page", filters.page.toString())
      if (filters.limit) params.set("limit", filters.limit.toString())

      const fetchPromise = fetch(`/api/anime?${params.toString()}`)
      const dataPromise = (async () => {
        const res = await fetchPromise
        if (!res.ok) throw new Error("Failed to fetch anime")
        return await res.json()
      })()

      inflight.set(key, dataPromise)
      const data = await dataPromise
      searchCache.set(key, { ts: Date.now(), data })
      inflight.delete(key)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getAnimeDetails = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const key = `details:${id}`
      const cached = detailsCache.get(key)
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
        return cached.data
      }

      if (inflight.has(key)) return await inflight.get(key)

      const fetchPromise = fetch(`/api/anime/${id}`)
      const dataPromise = (async () => {
        const res = await fetchPromise
        if (!res.ok) throw new Error("Failed to fetch anime details")
        return await res.json()
      })()

      inflight.set(key, dataPromise)
      const data = await dataPromise
      detailsCache.set(key, { ts: Date.now(), data })
      inflight.delete(key)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getEpisodes = async (id: string, provider = "anidub") => {
    setLoading(true)
    setError(null)

    try {
      const key = `episodes:${id}:${provider}`
      const cached = episodesCache.get(key)
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
        return cached.data
      }

      if (inflight.has(key)) return await inflight.get(key)

      const fetchPromise = fetch(`/api/anime/${id}/episodes?provider=${provider}`)
      const dataPromise = (async () => {
        const res = await fetchPromise
        if (!res.ok) throw new Error("Failed to fetch episodes")
        return await res.json()
      })()

      inflight.set(key, dataPromise)
      const data = await dataPromise
      episodesCache.set(key, { ts: Date.now(), data })
      inflight.delete(key)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    searchAnime,
    getAnimeDetails,
    getEpisodes,
  }
}
