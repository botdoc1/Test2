"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, Menu, X, Play, Star, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">AnimeHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/catalog" className="text-foreground/80 hover:text-foreground transition-colors">
              Каталог
            </Link>
            <Link href="/genres" className="text-foreground/80 hover:text-foreground transition-colors">
              Жанры
            </Link>
            <Link href="/top" className="text-foreground/80 hover:text-foreground transition-colors">
              Топ аниме
            </Link>
            <Link href="/random" className="text-foreground/80 hover:text-foreground transition-colors">
              Случайное
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Поиск аниме..." className="pl-10 w-64" />
            </div>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium">{user.username}</div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          Ур. {user.level}
                        </Badge>
                        {user.role === "premium" && (
                          <Badge variant="default" className="text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Профиль
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">
                      <Star className="w-4 h-4 mr-2" />
                      Избранное
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
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
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Войти</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Регистрация</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Поиск аниме..." className="pl-10 w-full" />
            </div>
            <nav className="flex flex-col space-y-2">
              <Link href="/catalog" className="text-foreground/80 hover:text-foreground transition-colors py-2">
                Каталог
              </Link>
              <Link href="/genres" className="text-foreground/80 hover:text-foreground transition-colors py-2">
                Жанры
              </Link>
              <Link href="/top" className="text-foreground/80 hover:text-foreground transition-colors py-2">
                Топ аниме
              </Link>
              <Link href="/random" className="text-foreground/80 hover:text-foreground transition-colors py-2">
                Случайное
              </Link>
            </nav>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 p-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{user.username}</div>
                      <Badge variant="secondary" className="text-xs">
                        Ур. {user.level}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Профиль
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/favorites">
                      <Star className="w-4 h-4 mr-2" />
                      Избранное
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/auth/login">Войти</Link>
                  </Button>
                  <Button className="justify-start" asChild>
                    <Link href="/auth/register">Регистрация</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
