"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Edit, Crown, Star, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function ProfileHeader() {
  const { user } = useAuth()

  if (!user) return null

  const experienceToNextLevel = 1500
  const progressPercentage = (user.experience / experienceToNextLevel) * 100

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">{user.username[0]}</AvatarFallback>
          </Avatar>
          <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Уровень {user.level}</span>
                </Badge>
                {user.role === "premium" && (
                  <Badge variant="default" className="flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>Premium</span>
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          {/* Experience Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Опыт до следующего уровня</span>
              <span className="font-medium">
                {user.experience} / {experienceToNextLevel} XP
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Join Date */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Присоединился в январе 2024
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <Button>Редактировать профиль</Button>
          <Button variant="outline">Поделиться профилем</Button>
        </div>
      </div>
    </div>
  )
}
