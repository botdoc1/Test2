"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Play, Home, Bell, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

export function AdminHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-gradient">AnimeHub</span>
              <Badge variant="destructive" className="ml-2 text-xs">
                ADMIN
              </Badge>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                На сайт
              </Link>
            </Button>

            {/* Admin Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user?.username?.[0] || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium">{user?.username || "Admin"}</div>
                    <Badge variant="destructive" className="text-xs">
                      Администратор
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Настройки
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
