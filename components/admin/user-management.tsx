"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Search, MoreHorizontal, UserPlus, Ban, Shield, Crown, Mail, Calendar } from "lucide-react"

const users = [
  {
    id: 1,
    username: "AnimeUser123",
    email: "user123@example.com",
    role: "user",
    status: "active",
    level: 5,
    joinDate: "2024-01-15",
    lastActive: "2024-01-25",
    avatar: "/anime-fan-avatar.png",
  },
  {
    id: 2,
    username: "OtakuMaster",
    email: "otaku@example.com",
    role: "premium",
    status: "active",
    level: 12,
    joinDate: "2023-11-20",
    lastActive: "2024-01-25",
    avatar: "/otaku-avatar.png",
  },
  {
    id: 3,
    username: "ModeratorSan",
    email: "mod@example.com",
    role: "moderator",
    status: "active",
    level: 25,
    joinDate: "2023-08-10",
    lastActive: "2024-01-25",
    avatar: "/abstract-user-avatar.png",
  },
  {
    id: 4,
    username: "SpamBot",
    email: "spam@example.com",
    role: "user",
    status: "banned",
    level: 1,
    joinDate: "2024-01-20",
    lastActive: "2024-01-22",
    avatar: "/placeholder.svg",
  },
]

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "destructive"
    case "moderator":
      return "default"
    case "premium":
      return "secondary"
    default:
      return "outline"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "default"
    case "banned":
      return "destructive"
    case "suspended":
      return "secondary"
    default:
      return "outline"
  }
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleUserAction = (userId: number, action: string) => {
    console.log(`Действие ${action} для пользователя ${userId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление пользователями</h1>
          <p className="text-muted-foreground">Управляйте пользователями, ролями и правами доступа</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Добавить пользователя
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Активных</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11,890</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Заблокированных</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">455</div>
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
                placeholder="Поиск пользователей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все роли</SelectItem>
                <SelectItem value="user">Пользователь</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="moderator">Модератор</SelectItem>
                <SelectItem value="admin">Администратор</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активный</SelectItem>
                <SelectItem value="suspended">Приостановлен</SelectItem>
                <SelectItem value="banned">Заблокирован</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass-effect">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Уровень</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead>Последняя активность</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleColor(user.role)} className="capitalize">
                      {user.role === "premium" && <Crown className="w-3 h-3 mr-1" />}
                      {user.role === "moderator" && <Shield className="w-3 h-3 mr-1" />}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(user.status)} className="capitalize">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Ур. {user.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(user.joinDate).toLocaleDateString("ru-RU")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.lastActive).toLocaleDateString("ru-RU")}
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
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "view")}>
                          Просмотр профиля
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "edit")}>
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, "message")}>
                          <Mail className="w-4 h-4 mr-2" />
                          Отправить сообщение
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "active" ? (
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "ban")}
                            className="text-destructive"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Заблокировать
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "unban")}>
                            Разблокировать
                          </DropdownMenuItem>
                        )}
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
