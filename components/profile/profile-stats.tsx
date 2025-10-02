"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Eye, Heart, Clock, Trophy, Star } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface ExpData {
  currentXp: number
  currentLevel: number
  nextLevelXp: number
  progress: number
}

export function ProfileStats() {
  const { user } = useAuth()
  const [expData, setExpData] = useState<ExpData | null>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) return

        const res = await fetch('/api/users/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setFavoriteCount(data.favorites?.length || 0)
        }
      } catch (e) {
        console.error('Failed to fetch favorites:', e)
      }
    }

    async function fetchExp() {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) return

        const res = await fetch('/api/users/exp', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setExpData(data.data)
        }
      } catch (e) {
        console.error('Failed to fetch exp:', e)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      Promise.all([fetchExp(), fetchFavorites()])
        .finally(() => setLoading(false))
    }
  }, [user])

  const stats = [
    {
      title: "Просмотрено",
      value: "0",
      subtitle: "аниме",
      icon: Eye,
      color: "text-blue-500",
    },
    {
      title: "В избранном",
      value: favoriteCount.toString(),
      subtitle: "тайтлов",
      icon: Heart,
      color: "text-red-500",
    },
    {
      title: "Время просмотра",
      value: "0",
      subtitle: "часов",
      icon: Clock,
      color: "text-green-500",
    },
    {
      title: "Достижения",
      value: "0",
      subtitle: "получено",
      icon: Trophy,
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
