"use client"

import { useState, useEffect } from "react"
import { AnimePlayer } from "@/components/anime-player"
import { AnimeInfo } from "@/components/anime-info"
import { EpisodeList } from "@/components/episode-list"
import { CommentSection } from "@/components/comment-section"
import { SimilarAnime } from "@/components/similar-anime"
import { Header } from "@/components/header"
import { useAnime, type AnimeData } from "@/hooks/use-anime"
import { Button } from "@/components/ui/button"

export default function AnimePage({ params }: { params: { id: string } }) {
  const [animeData, setAnimeData] = useState<AnimeData | null>(null)
  const [episodes, setEpisodes] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>("anidub")
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const { loading, error, getAnimeDetails, getEpisodes } = useAnime()

  useEffect(() => {
    loadAnimeData()
  }, [params.id])

  useEffect(() => {
    if (animeData && selectedProvider) {
      loadEpisodes()
    }
  }, [selectedProvider, animeData])

  const loadAnimeData = async () => {
    try {
      const data = await getAnimeDetails(params.id)
      setAnimeData(data)

      // Устанавливаем первую доступную озвучку по умолчанию
      if (data.availableDubs && data.availableDubs.length > 0) {
        setSelectedProvider(data.availableDubs[0].provider)
      }
    } catch (err) {
      console.error("Failed to load anime:", err)
    }
  }

  const loadEpisodes = async () => {
    try {
      const episodeData = await getEpisodes(params.id, selectedProvider)
      // Нормализуем структуру эпизодов для EpisodeList
      const raw = episodeData.episodes || []
      const normalized = raw.map((ep: any) => ({
        id: ep.number || Math.random(),
        number: ep.number,
        title: ep.title || `Серия ${ep.number}`,
        duration: ep.duration || ep.time || "",
        watched: false,
        sources: ep.sources || {},
      }))
      setEpisodes(normalized)
    } catch (err) {
      console.error("Failed to load episodes:", err)
    }
  }

  if (loading && !animeData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-muted rounded-xl"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !animeData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Аниме не найдено</h1>
          <p className="text-muted-foreground mb-4">{error || "Не удалось загрузить данные об аниме"}</p>
          <Button onClick={() => window.history.back()}>Вернуться назад</Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AnimePlayer
              anime={{
                id: animeData.id,
                title: animeData.title,
                currentEpisode,
                availableDubs: animeData.availableDubs,
                selectedProvider,
                onProviderChange: setSelectedProvider,
              }}
            />
            <AnimeInfo anime={{
              id: animeData.id,
              title: animeData.title,
              originalTitle: animeData.titleEnglish ?? animeData.titleJapanese ?? animeData.title,
              year: animeData.year,
              rating: (animeData as any).rating ?? animeData.score ?? 0,
              status: animeData.status,
              episodes: animeData.episodes,
              duration: (animeData as any).duration ?? "",
              studio: animeData.studios && animeData.studios.length > 0 ? animeData.studios[0] : ((animeData as any).studio ?? ""),
              genres: animeData.genres,
              description: animeData.synopsis ?? (animeData as any).description ?? "",
              poster: animeData.image ?? (animeData as any).poster ?? "",
            }} />
            <CommentSection animeId={animeData.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <EpisodeList
              episodes={episodes}
              currentEpisode={currentEpisode}
              onEpisodeSelect={setCurrentEpisode}
            />
            <SimilarAnime animeId={animeData.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
