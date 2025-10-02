import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, Eye, MessageSquare, TrendingUp, AlertTriangle, Shield, Activity } from "lucide-react"

const stats = [
  {
    title: "Всего пользователей",
    value: "12,345",
    change: "+12%",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Аниме в каталоге",
    value: "5,678",
    change: "+3%",
    changeType: "positive",
    icon: FileText,
  },
  {
    title: "Просмотров сегодня",
    value: "89,123",
    change: "+8%",
    changeType: "positive",
    icon: Eye,
  },
  {
    title: "Новых комментариев",
    value: "234",
    change: "-5%",
    changeType: "negative",
    icon: MessageSquare,
  },
]

const recentActivity = [
  {
    id: 1,
    type: "user_registered",
    message: "Новый пользователь AnimeUser123 зарегистрировался",
    time: "2 минуты назад",
    icon: Users,
    color: "text-green-500",
  },
  {
    id: 2,
    type: "content_added",
    message: "Добавлено новое аниме: Атака титанов (сезон 4)",
    time: "15 минут назад",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    id: 3,
    type: "report_received",
    message: "Получена жалоба на комментарий пользователя BadUser",
    time: "1 час назад",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  {
    id: 4,
    type: "user_banned",
    message: "Пользователь SpamBot заблокирован",
    time: "2 часа назад",
    icon: Shield,
    color: "text-orange-500",
  },
]

const pendingTasks = [
  {
    id: 1,
    title: "Модерация комментариев",
    count: 23,
    priority: "high",
  },
  {
    id: 2,
    title: "Рассмотрение жалоб",
    count: 12,
    priority: "high",
  },
  {
    id: 3,
    title: "Проверка нового контента",
    count: 5,
    priority: "medium",
  },
  {
    id: 4,
    title: "Обновление метаданных",
    count: 34,
    priority: "low",
  },
]

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">Обзор активности и управление сайтом</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs px-1">
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">за месяц</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Последняя активность</span>
            </CardTitle>
            <Button variant="ghost" size="sm">
              Показать все
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Требует внимания</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {task.priority === "high" ? "Высокий" : task.priority === "medium" ? "Средний" : "Низкий"}
                  </Badge>
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {task.count}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    Перейти
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <Users className="w-6 h-6" />
              <span>Добавить пользователя</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <FileText className="w-6 h-6" />
              <span>Добавить аниме</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Shield className="w-6 h-6" />
              <span>Модерация</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <TrendingUp className="w-6 h-6" />
              <span>Аналитика</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
