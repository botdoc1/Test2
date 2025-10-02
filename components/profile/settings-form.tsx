"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Upload, Save, Shield, Bell, Palette, Globe } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function SettingsForm() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [settings, setSettings] = useState({
    // Profile settings
    username: user?.username || "",
    email: user?.email || "",
    bio: "",

    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    commentNotifications: true,
    newEpisodeNotifications: true,

    // Appearance settings
    theme: "dark",
    language: "ru",
    autoplay: true,
    quality: "1080p",

    // Privacy settings
    profileVisibility: "public",
    showWatchHistory: true,
    showFavorites: true,
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Имитация сохранения настроек
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Обновляем пользователя
      updateUser({
        username: settings.username,
        email: settings.email,
      })

      console.log("Настройки сохранены:", settings)
    } catch (error) {
      console.error("Ошибка сохранения:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Профиль</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xl">{user.username[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Загрузить фото
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG до 5MB</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">О себе</Label>
            <Textarea
              id="bio"
              placeholder="Расскажите о себе..."
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Уведомления</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email уведомления</Label>
              <p className="text-sm text-muted-foreground">Получать уведомления на email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Push уведомления</Label>
              <p className="text-sm text-muted-foreground">Уведомления в браузере</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Комментарии</Label>
              <p className="text-sm text-muted-foreground">Уведомления о новых комментариях</p>
            </div>
            <Switch
              checked={settings.commentNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, commentNotifications: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Новые эпизоды</Label>
              <p className="text-sm text-muted-foreground">Уведомления о выходе новых серий</p>
            </div>
            <Switch
              checked={settings.newEpisodeNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, newEpisodeNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Внешний вид</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Тема</Label>
              <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="dark">Темная</SelectItem>
                  <SelectItem value="auto">Автоматически</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Язык</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Автовоспроизведение</Label>
              <p className="text-sm text-muted-foreground">Автоматически воспроизводить следующий эпизод</p>
            </div>
            <Switch
              checked={settings.autoplay}
              onCheckedChange={(checked) => setSettings({ ...settings, autoplay: checked })}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Качество по умолчанию</Label>
            <Select value={settings.quality} onValueChange={(value) => setSettings({ ...settings, quality: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="480p">480p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
                <SelectItem value="auto">Автоматически</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Приватность</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Видимость профиля</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value) => setSettings({ ...settings, profileVisibility: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Публичный</SelectItem>
                <SelectItem value="friends">Только друзья</SelectItem>
                <SelectItem value="private">Приватный</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Показывать историю просмотра</Label>
              <p className="text-sm text-muted-foreground">Другие пользователи смогут видеть что вы смотрели</p>
            </div>
            <Switch
              checked={settings.showWatchHistory}
              onCheckedChange={(checked) => setSettings({ ...settings, showWatchHistory: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Показывать избранное</Label>
              <p className="text-sm text-muted-foreground">Другие пользователи смогут видеть ваше избранное</p>
            </div>
            <Switch
              checked={settings.showFavorites}
              onCheckedChange={(checked) => setSettings({ ...settings, showFavorites: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Premium Status */}
      {user.role !== "premium" && (
        <Card className="glass-effect border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Badge variant="default" className="text-lg px-4 py-2">
                Получить Premium
              </Badge>
              <p className="text-muted-foreground">
                Получите доступ к эксклюзивным функциям, просмотру без рекламы и многому другому
              </p>
              <Button size="lg" className="w-full md:w-auto">
                Оформить подписку
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} size="lg">
          {isLoading ? (
            <>Сохранение...</>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Сохранить изменения
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
