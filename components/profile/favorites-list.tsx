"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Star, Calendar, Search, Heart, X } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { useAnime } from "@/hooks/use-anime"

export function FavoritesList() {
  const { favorites, loading: favLoading, fetchFavorites, removeFavorite } = useFavorites()
  const { getAnimeDetails } = useAnime()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("added")
  const [filterGenre, setFilterGenre] = useState("all")
  const [animeItems, setAnimeItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // whenever favorites change, load details
    let mounted = true
    async function loadDetails() {
      setLoading(true)
      try {
        const items = await Promise.all(
          favorites.map(async (id) => {
            try {
              const res = await getAnimeDetails(String(id))
              // API may return either the object directly or { data: object }
              return res?.data ?? res
            } catch (e) {
              console.error('Failed to load anime details for', id, e)
              return null
            }
          })
        )
        if (!mounted) return
        setAnimeItems(items.filter(Boolean))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (favorites.length > 0) {
      loadDetails()
    } else {
      setAnimeItems([])
    }

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites])

  useEffect(() => {
    // ensure favorites are fetched on mount
    fetchFavorites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredAnime = animeItems.filter((anime) => anime.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleRemove = async (id: number | string) => {
    try {
      await removeFavorite(id)
      // fetchFavorites() will update favorites and trigger details reload
    } catch (e) {
      console.error('Failed to remove favorite', e)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-effect rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск в избранном..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="added">По дате добавления</SelectItem>
              <SelectItem value="title">По названию</SelectItem>
              <SelectItem value="rating">По рейтингу</SelectItem>
              <SelectItem value="year">По году</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterGenre} onValueChange={setFilterGenre}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Жанр" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все жанры</SelectItem>
              <SelectItem value="action">Экшен</SelectItem>
              <SelectItem value="drama">Драма</SelectItem>
              <SelectItem value="fantasy">Фэнтези</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Найдено {filteredAnime.length} из {animeItems.length} аниме</p>
        <div className="flex items-center space-x-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium">{animeItems.length} в избранном</span>
        </div>
      </div>

      {/* Anime Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAnime.map((anime) => (
          <div key={anime.id} className="glass-effect rounded-xl overflow-hidden group">
            {/* Poster */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20">
              <img src={anime.image || "/placeholder.svg"} alt={anime.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="lg" className="rounded-full">
                  <Play className="w-5 h-5 mr-2" />
                  Смотреть
                </Button>
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(anime.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg leading-tight line-clamp-2">{anime.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {anime.year}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {anime.score || anime.rating || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {anime.genres?.slice(0, 2).map((genre: string) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
                {anime.genres && anime.genres.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{anime.genres.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                <span>Добавлено: —</span>
                <Badge variant={anime.status === "Выходит" ? "default" : "secondary"} className="text-xs">
                  {anime.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(filteredAnime.length === 0 && !loading && !favLoading) && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
          <p className="text-muted-foreground">Добавьте аниме в избранное, чтобы они появились здесь</p>
        </div>
      )}
    </div>
  )
}
