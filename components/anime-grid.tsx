"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Star, Calendar, Eye } from "lucide-react"
import { useAnime, type AnimeData } from "@/hooks/use-anime"
import Link from "next/link"

interface AnimeGridProps {
  searchFilters?: {
    query?: string
    genre?: string
    year?: string
    status?: string
  }
}

export function AnimeGrid({ searchFilters }: AnimeGridProps) {
  const [animeList, setAnimeList] = useState<AnimeData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { loading, error, searchAnime } = useAnime()

  useEffect(() => {
    loadAnime()
  }, [searchFilters])

  const loadAnime = async (page = 1) => {
    try {
      const data = await searchAnime({
        ...searchFilters,
        page,
        limit: 20,
      })

      if (page === 1) {
        setAnimeList(data.data)
      } else {
        setAnimeList((prev) => [...prev, ...data.data])
      }

      setCurrentPage(page)
      setTotalPages(data.pagination?.last_visible_page || 1)
    } catch (err) {
      console.error("Failed to load anime:", err)
    }
  }

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      loadAnime(currentPage + 1)
    }
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Ошибка загрузки: {error}</p>
          <Button onClick={() => loadAnime(1)} className="mt-4">
            Попробовать снова
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                {searchFilters?.query ? `Результаты поиска: "${searchFilters.query}"` : "Популярные аниме"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {searchFilters?.query
                  ? `Найдено аниме по запросу "${searchFilters.query}"`
                  : "Самые популярные и высокорейтинговые аниме"}
              </p>
            </div>
            <Button variant="outline">Смотреть все</Button>
          </div>

          {/* Loading State */}
          {loading && animeList.length === 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-hover glass-effect rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-muted"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Anime Grid */}
          {animeList.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {animeList.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <div className="card-hover glass-effect rounded-xl overflow-hidden">
                    {/* Poster */}
                    <div className="aspect-[3/4] relative">
                      {anime.image ? (
                        <img
                          src={anime.image || "/placeholder.svg"}
                          alt={anime.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Play className="w-12 h-12 text-primary/60" />
                        </div>
                      )}

                      {/* Dub indicators */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {anime.availableDubs?.slice(0, 2).map((dub) => (
                          <Badge key={dub.provider} variant="secondary" className="text-xs">
                            {dub.provider}
                          </Badge>
                        ))}
                        {anime.availableDubs?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{anime.availableDubs.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Title and Year */}
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">{anime.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {anime.year}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {anime.score?.toFixed(1) || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {anime.synopsis || "Описание недоступно"}
                      </p>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1">
                        {anime.genres?.slice(0, 2).map((genre) => (
                          <Badge key={genre} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                        {anime.genres?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{anime.genres.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Stats and Action */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {anime.episodes || "?"} эп.
                          </div>
                          <Badge
                            variant={anime.status === "Currently Airing" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {anime.status === "Currently Airing"
                              ? "Выходит"
                              : anime.status === "Finished Airing"
                                ? "Завершено"
                                : anime.status}
                          </Badge>
                        </div>
                        <Button size="sm">
                          <Play className="w-3 h-3 mr-1" />
                          Смотреть
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More */}
          {animeList.length > 0 && currentPage < totalPages && (
            <div className="text-center pt-8">
              <Button variant="outline" size="lg" onClick={loadMore} disabled={loading}>
                {loading ? "Загрузка..." : "Загрузить ещё"}
              </Button>
            </div>
          )}

          {/* No Results */}
          {!loading && animeList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Аниме не найдено</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
