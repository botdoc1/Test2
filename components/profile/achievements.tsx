import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Eye, Heart, MessageCircle, Crown } from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "Первые шаги",
    description: "Посмотрел первое аниме",
    icon: Eye,
    earned: true,
    rarity: "common",
  },
  {
    id: 2,
    title: "Коллекционер",
    description: "Добавил 10 аниме в избранное",
    icon: Heart,
    earned: true,
    rarity: "uncommon",
  },
  {
    id: 3,
    title: "Критик",
    description: "Оставил 50 комментариев",
    icon: MessageCircle,
    earned: true,
    rarity: "rare",
  },
  {
    id: 4,
    title: "Марафонец",
    description: "Посмотрел 100 аниме",
    icon: Trophy,
    earned: false,
    rarity: "epic",
    progress: "87/100",
  },
  {
    id: 5,
    title: "Легенда",
    description: "Достиг 10 уровня",
    icon: Crown,
    earned: false,
    rarity: "legendary",
    progress: "5/10",
  },
]

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "bg-gray-500"
    case "uncommon":
      return "bg-green-500"
    case "rare":
      return "bg-blue-500"
    case "epic":
      return "bg-purple-500"
    case "legendary":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

export function Achievements() {
  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Достижения</CardTitle>
        <Badge variant="secondary">15/25</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
              achievement.earned
                ? "bg-primary/5 border-primary/20"
                : "bg-muted/30 border-border opacity-60 hover:opacity-80"
            }`}
          >
            <div
              className={`p-2 rounded-full text-white ${getRarityColor(achievement.rarity)} ${
                !achievement.earned && "grayscale"
              }`}
            >
              <achievement.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium truncate">{achievement.title}</p>
                <Badge variant="outline" className="text-xs capitalize">
                  {achievement.rarity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              {!achievement.earned && achievement.progress && (
                <p className="text-xs text-primary mt-1">Прогресс: {achievement.progress}</p>
              )}
            </div>
            {achievement.earned && <Star className="w-4 h-4 text-yellow-500" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
