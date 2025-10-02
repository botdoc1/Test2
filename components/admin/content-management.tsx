"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Plus, Edit, Trash2, Eye, Star, Calendar } from "lucide-react"

const animeContent = [
  {
    id: 1,
    title: "Атака титанов",
    originalTitle: "Shingeki no Kyojin",
    year: 2013,
    status: "completed",
    episodes: 87,
    rating: 9.0,
    views: 1250000,
    addedDate: "2023-12-01",
    lastUpdated: "2024-01-20",
    poster: "/attack-on-titan-inspired-poster.png",
  },
  {
    id: 2,
    title: "Магическая битва",
    originalTitle: "Jujutsu Kaisen",
    year: 2020,
    status: "ongoing",
    episodes: 24,
    rating: 8.9,
    views: 890000,
    addedDate: "2024-01-10",
    lastUpdated: "2024-01-25",
    poster: "/jujutsu-kaisen-poster.jpg",
  },
  {
    id: 3,
    title: "Клинок, рассекающий демонов",
    originalTitle: "Kimetsu no Yaiba",
    year: 2019,
    status: "completed",
    episodes: 44,
    rating: 8.8,
    views: 1100000,
    addedDate: "2023-11-15",
    lastUpdated: "2024-01-15",
    poster: "/demon-slayer-poster.jpg",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "ongoing":
      return "default"
    case "completed":
      return "secondary"
    case "announced":
      return "outline"
    default:
      return "outline"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "ongoing":
      return "Выходит"
    case "completed":
      return "Завершено"
    case "announced":
      return "Анонсировано"
    default:
      return status
  }
}

export function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")

  const filteredContent = animeContent.filter((anime) => {
    const matchesSearch =
      anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anime.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || anime.status === statusFilter
    const matchesYear = yearFilter === "all" || anime.year.toString() === yearFilter
    return matchesSearch && matchesStatus && matchesYear
  })

  const handleContentAction = (contentId: number, action: string) => {
    console.log(`Действие ${action} для контента ${contentId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление контентом</h1>
          <p className="text-muted-foreground">Управляйте аниме, эпизодами и метаданными</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить аниме
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего аниме</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,678</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Выходящих</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего эпизодов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,123</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Просмотров</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5M</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-effect">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск аниме..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="ongoing">Выходит</SelectItem>
                <SelectItem value="completed">Завершено</SelectItem>
                <SelectItem value="announced">Анонсировано</SelectItem>
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Год" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все годы</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card className="glass-effect">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Аниме</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Эпизоды</TableHead>
                <TableHead>Рейтинг</TableHead>
                <TableHead>Просмотры</TableHead>
                <TableHead>Обновлено</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((anime) => (
                <TableRow key={anime.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={anime.poster || "/placeholder.svg"}
                          alt={anime.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{anime.title}</div>
                        <div className="text-sm text-muted-foreground">{anime.originalTitle}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {anime.year}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(anime.status)}>{getStatusText(anime.status)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{anime.episodes} эп.</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{anime.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>{(anime.views / 1000000).toFixed(1)}M</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(anime.lastUpdated).toLocaleDateString("ru-RU")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleContentAction(anime.id, "view")}>
                          <Eye className="w-4 h-4 mr-2" />
                          Просмотр
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContentAction(anime.id, "edit")}>
                          <Edit className="w-4 h-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContentAction(anime.id, "episodes")}>
                          Управление эпизодами
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleContentAction(anime.id, "delete")}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
