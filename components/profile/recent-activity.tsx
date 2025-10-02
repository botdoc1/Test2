"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Star, MessageCircle, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

interface Activity {
  id: string
  type: "watched" | "favorite" | "comment" | "completed"
  title: string
  episode?: string
  timestamp: number
  animeId: number
}

const ICONS = {
  watched: Play,
  favorite: Star,
  comment: MessageCircle,
  completed: Eye,
} as const

const getActivityText = (activity: Activity) => {
  switch (activity.type) {
    case "watched":
      return `Посмотрел ${activity.episode}`
    case "favorite":
      return "Добавил в избранное"
    case "comment":
      return "Оставил комментарий"
    case "completed":
      return "Завершил просмотр"
    default:
      return ""
  }
}

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "watched":
      return "text-blue-500"
    case "favorite":
      return "text-red-500"
    case "comment":
      return "text-green-500"
    case "completed":
      return "text-purple-500"
    default:
      return "text-muted-foreground"
  }
}

const formatTimestamp = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} назад`
  if (hours > 0) return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} назад`
  if (minutes > 0) return `${minutes} ${minutes === 1 ? 'минуту' : minutes < 5 ? 'минуты' : 'минут'} назад`
  return 'только что'
}

export function RecentActivity() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) return

        const res = await fetch('/api/users/activities', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setActivities(data.activities)
        }
      } catch (e) {
        console.error('Failed to fetch activities:', e)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchActivities()
    }
  }, [user])

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Последняя активность</CardTitle>
        <Button variant="ghost" size="sm">
          Показать все
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center text-muted-foreground">Загрузка...</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground">Нет активности</div>
        ) : activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
              {(() => {
                const Icon = ICONS[activity.type]
                return Icon ? <Icon className="w-4 h-4" /> : null
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{getActivityText(activity)}</p>
            </div>
            <div className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
