import { type NextRequest, NextResponse } from "next/server"

const SERVER_CACHE_TTL = 1000 * 60 * 5 // 5 минут
const detailsCache = new Map<string, { ts: number; data: any }>()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Проверяем кэш
  const cached = detailsCache.get(id)
  if (cached && Date.now() - cached.ts < SERVER_CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=59" }
    })
  }

  try {
    // Получаем данные из Jikan API с таймаутом
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const jikanResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`, {
      signal: controller.signal
    })
    clearTimeout(timeout)

    const jikanData = await jikanResponse.json()

    if (!jikanData.data) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 })
    }

    const anime = jikanData.data

    // Используем моковые данные о доступных озвучках (быстро)
    const dubInfo = [
      {
        provider: "anidub",
        quality: ["1080p", "720p", "480p"],
        description: "Озвучка от AniDub",
      },
      {
        provider: "animevost",
        quality: ["1080p", "720p"],
        description: "Озвучка от AnimeVost",
      },
    ]

    // Загружаем рекомендации асинхронно без блокировки основного ответа
    let recommendations: any[] = []
    try {
      const recController = new AbortController()
      const recTimeout = setTimeout(() => recController.abort(), 3000)
      const recommendationsResponse = await fetch(
        `https://api.jikan.moe/v4/anime/${id}/recommendations`,
        { signal: recController.signal }
      )
      clearTimeout(recTimeout)
      const recommendationsData = await recommendationsResponse.json()
      recommendations = recommendationsData.data?.slice(0, 6).map((rec: any) => ({
        id: rec.entry.mal_id,
        title: rec.entry.title,
        image: rec.entry.images?.jpg?.image_url,
        votes: rec.votes,
      })) || []
    } catch (recError) {
      console.log("Failed to fetch recommendations, skipping")
    }

    const detailedAnime = {
      id: anime.mal_id,
      title: anime.title,
      titleEnglish: anime.title_english,
      titleJapanese: anime.title_japanese,
      synopsis: anime.synopsis,
      background: anime.background,
      image: anime.images?.jpg?.large_image_url,
      trailer: anime.trailer?.youtube_id,
      score: anime.score,
      scoredBy: anime.scored_by,
      rank: anime.rank,
      popularity: anime.popularity,
      episodes: anime.episodes,
      duration: anime.duration,
      status: anime.status,
      aired: anime.aired,
      season: anime.season,
      year: anime.year,
      broadcast: anime.broadcast,
      producers: anime.producers?.map((p: any) => p.name) || [],
      licensors: anime.licensors?.map((l: any) => l.name) || [],
      studios: anime.studios?.map((s: any) => s.name) || [],
      genres: anime.genres?.map((g: any) => g.name) || [],
      themes: anime.themes?.map((t: any) => t.name) || [],
      demographics: anime.demographics?.map((d: any) => d.name) || [],
      rating: anime.rating,
      availableDubs: dubInfo,
      recommendations,
    }

    // Сохраняем в серверный кэш
    detailsCache.set(id, { ts: Date.now(), data: detailedAnime })
    return NextResponse.json(detailedAnime, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=59" }
    })
  } catch (error) {
    console.error("Error fetching anime details:", error)
    return NextResponse.json({ error: "Failed to fetch anime details" }, { status: 500 })
  }
}

