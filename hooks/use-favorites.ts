"use client"

import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch on mount if token exists (covers case when user isn't populated yet)
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token) {
      fetchFavorites()
    } else {
      setFavorites([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Also refetch when user changes (login/logout)
  useEffect(() => {
    if (!user) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      if (!token) {
        setFavorites([])
        return
      }
    }
    fetchFavorites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function fetchFavorites() {
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setFavorites([])
        return
      }
      const res = await fetch('/api/favorites', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) {
        setFavorites([])
        return
      }
      const data = await res.json()
      setFavorites(data.data.map((f: any) => String(f.animeId)))
    } catch (e) {
      console.error(e)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  async function addFavorite(animeId: number | string) {
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('Unauthorized')
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ animeId }),
    })
    if (!res.ok) throw new Error('Failed')
    // refresh to stay consistent with backend
    await fetchFavorites()
  }

  async function removeFavorite(animeId: number | string) {
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('Unauthorized')
    const res = await fetch('/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ animeId }),
    })
    if (!res.ok) throw new Error('Failed')
    // refresh to stay consistent with backend
    await fetchFavorites()
  }

  return { favorites, loading, fetchFavorites, addFavorite, removeFavorite }
}
