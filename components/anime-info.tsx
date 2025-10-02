"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Bookmark, Share, Calendar, Clock, Building, Eye } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/components/ui/use-toast"
import { useState } from 'react'

interface AnimeInfoProps {
  anime: {
    id: number
    title: string
    originalTitle: string
    year: number
    rating: number
    status: string
    episodes: number
    duration: string
    studio: string
    genres: string[]
    description: string
    poster: string
  }
}

export function AnimeInfo({ anime }: AnimeInfoProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const [favLoading, setFavLoading] = useState(false)
  const isFav = favorites.includes(String(anime.id))
  const { toast } = useToast()
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={async () => {
          setFavLoading(true)
          try {
            if (isFav) {
              await removeFavorite(anime.id)
            } else {
              await addFavorite(anime.id)
              // Добавляем опыт за добавление в избранное
              const token = localStorage.getItem('auth_token')
              if (token) {
                const res = await fetch('/api/users/exp', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({ action: 'ADD_FAVORITE' })
                })
                if (res.ok) {
                  const data = await res.json()
                  if (data.data.levelUp) {
                    toast({
                      title: `Уровень повышен!`,
                      description: `Поздравляем! Вы достигли ${data.data.currentLevel} уровня!`,
                    })
                  } else {
                    toast({
                      description: `+${data.data.gained} опыта`,
                    })
                  }
                }
              }
            }
          } catch (e) {
            console.error(e)
            toast({
              variant: 'destructive',
              title: 'Ошибка',
              description: 'Не удалось обновить избранное',
            })
          } finally {
            setFavLoading(false)
          }
        }}>
          <Heart className={`w-4 h-4 mr-2 ${isFav ? 'text-red-500' : ''}`} />{isFav ? 'В избранном' : 'В избранное'}
        </Button>
        <Button variant="outline">
          <Bookmark className="w-4 h-4 mr-2" />
          Буду смотреть
        </Button>
        <Button variant="outline">
          <Share className="w-4 h-4 mr-2" />
          Поделиться
        </Button>
        <Button variant="outline">
          <Star className="w-4 h-4 mr-2" />
          Оценить
        </Button>
      </div>

      {/* Anime Details */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Poster */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <img
              src={anime.poster || "/placeholder.svg"}
              alt={anime.title}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{anime.title}</h2>
            <p className="text-muted-foreground text-lg">{anime.originalTitle}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                Рейтинг
              </div>
              <div className="font-semibold">{anime.rating}/10</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                Год выпуска
              </div>
              <div className="font-semibold">{anime.year}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="w-4 h-4 mr-1" />
                Эпизодов
              </div>
              <div className="font-semibold">{anime.episodes}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                Длительность
              </div>
              <div className="font-semibold">{anime.duration}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Building className="w-4 h-4 mr-1" />
                Студия
              </div>
              <div className="font-semibold">{anime.studio}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Статус</div>
              <Badge variant={anime.status === "Выходит" ? "default" : "secondary"}>{anime.status}</Badge>
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Жанры</div>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Описание</div>
            <p className="text-sm leading-relaxed">{anime.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
