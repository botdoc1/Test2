"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
// Note: hls.js is optional for playing .m3u8 in browsers. Install with `pnpm add hls.js` (or npm/yarn).
import Hls from "hls.js"
import { Button } from "./ui/button"

interface AnimePlayerProps {
  anime: {
    id: number
    title: string
    currentEpisode: number
    episodes?: Array<{
      id: number
      number: number
      title: string
      duration: string
      watched: boolean
      pageUrl?: string
      sources?: { [quality: string]: string }
    }>
    selectedProvider?: string
    onProviderChange?: (provider: string) => void
    availableDubs?: Array<{
      provider: string
      quality: string[]
      description?: string
    }>
  }
}

export function AnimePlayer({ anime }: AnimePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuality, setSelectedQuality] = useState("1080p")
  const [availableQualities, setAvailableQualities] = useState<string[]>([])
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  // Загрузка эпизода и списка качеств.
  // Сначала пытаемся взять URL из переданных episode.sources (если есть).
  // Иначе используем провайдера (provider.getAvailableQualities / getEpisodeUrl).
  useEffect(() => {
    let cancelled = false

    async function loadEpisode() {
      if (!anime.selectedProvider) {
        setError('Выберите озвучку')
        return
      }

      setIsLoading(true)
      setError(null)
      setVideoUrl(null)

      try {
        // Если в prop `anime.episodes` есть данные для текущего эпизода, используем их
        const ep = anime.episodes?.find((e) => e.number === anime.currentEpisode)
        if (ep && ep.sources) {
          const qualities = Object.keys(ep.sources)
          setAvailableQualities(qualities)
          // выберем качество или первый доступный
          const qualityToUse = qualities.includes(selectedQuality) ? selectedQuality : qualities[0]
          setSelectedQuality(qualityToUse)
          const url = ep.sources[qualityToUse]
          if (!cancelled) setVideoUrl(url)
          return
        }

        // fallback: обращаемся к серверному прокси, который вызывает провайдеров на сервере
        const providerName = anime.selectedProvider
  // include pageUrl if episode metadata contains it (best-effort for scraping)
  const epFound = anime.episodes?.find((e) => e.number === anime.currentEpisode)
  const epMetaPageUrl = (epFound as any)?.pageUrl as string | undefined
  const pageQuery = epMetaPageUrl ? `&pageUrl=${encodeURIComponent(epMetaPageUrl)}` : ''
  const qualitiesRes = await fetch(`/api/provider/${providerName}/qualities?animeId=${anime.id}&episode=${anime.currentEpisode}${pageQuery}`)
        if (!qualitiesRes.ok) throw new Error('Failed to load qualities from provider')
        const qualitiesJson = await qualitiesRes.json()
        const qualities: string[] = qualitiesJson.qualities || []
        setAvailableQualities(qualities)
        if (!selectedQuality || !qualities.includes(selectedQuality)) {
          if (qualities.length > 0) {
            setSelectedQuality(qualities[0])
            // don't return; fall through to fetch using newly selected quality
          } else {
            throw new Error('Нет доступных качеств для этого эпизода')
          }
        }

        const epRes = await fetch(`/api/provider/${providerName}/episode?animeId=${anime.id}&episode=${anime.currentEpisode}&quality=${selectedQuality}${pageQuery}`)
        if (!epRes.ok) throw new Error('Failed to load episode url from provider')
        const epJson = await epRes.json()
        const url = epJson.url
        if (!cancelled) setVideoUrl(url)
      } catch (e) {
        console.error('Failed to load episode:', e)
        if (!cancelled) setError(e instanceof Error ? e.message : 'Не удалось загрузить эпизод')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadEpisode()

    return () => {
      cancelled = true
    }
  }, [anime.id, anime.currentEpisode, anime.selectedProvider, selectedQuality, anime.episodes])

  // Начисление опыта при начале просмотра
  async function handlePlayStart() {
    if (isPlaying) return // Предотвращаем повторное начисление

    setIsPlaying(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const res = await fetch('/api/users/exp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'WATCH_EPISODE' })
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
            description: `+${data.data.gained} опыта за просмотр`,
          })
        }
      }
    } catch (e) {
      console.error('Failed to add watch exp:', e)
    }
  }

  // HLS handling: если URL указывает на .m3u8, используем hls.js
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // cleanup previous
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (!videoUrl) return

    if (videoUrl.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls()
        hlsRef.current = hls
        hls.loadSource(videoUrl)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isPlaying) video.play().catch(() => {})
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl
      } else {
        setError('HLS не поддерживается в этом браузере')
      }
    } else {
      // обычный mp4
      video.src = videoUrl
      if (isPlaying) video.play().catch(() => {})
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [videoUrl, isPlaying])

  if (error) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-[400px]">
        <Badge variant="destructive">{error}</Badge>
        <Button onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">{anime.title}</h1>
          <p className="text-muted-foreground">
            Эпизод {anime.currentEpisode}
            {isLoading && " - Загрузка..."}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Provider Selection */}
          {anime.onProviderChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Озвучка:</span>
              <Select value={anime.selectedProvider} onValueChange={anime.onProviderChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {anime.availableDubs?.map(dub => (
                    <SelectItem key={dub.provider} value={dub.provider}>
                      {dub.provider === "anidub" ? "AniDub" : "AnimeVost"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quality Selection */}
          {availableQualities.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Качество:</span>
              <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {availableQualities.map((quality) => (
                    <SelectItem key={quality} value={quality}>
                      {quality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Player */}
      <div className="relative aspect-video bg-black/90 rounded-lg overflow-hidden">
        {videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            onPlay={handlePlayStart}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            {isLoading ? "Загрузка видео..." : "Выберите озвучку и качество"}
          </div>
        )}
      </div>

      {/* Current Provider Info */}
      {anime.selectedProvider && (
        <div className="glass-effect rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
              <span className="text-xs font-bold">{anime.selectedProvider[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium">
                {anime.selectedProvider === "anidub" ? "AniDub" : "AnimeVost"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Загрузка..." : `Эпизод ${anime.currentEpisode}`}
              </p>
            </div>
            <div className="ml-auto flex gap-1">
              {availableQualities.map((quality) => (
                <Badge 
                  key={quality} 
                  variant={quality === selectedQuality ? "default" : "outline"} 
                  className="text-xs cursor-pointer"
                  onClick={() => setSelectedQuality(quality)}
                >
                  {quality}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}