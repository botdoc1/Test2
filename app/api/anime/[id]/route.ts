import { type NextRequest, NextResponse } from "next/server"

const SERVER_CACHE_TTL = 1000 * 60 * 5 // 5 минут
const detailsCache = new Map<string, { ts: number; data: any }>()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  // Проверяем кэш
  const cached = detailsCache.get(id)
  if (cached && Date.now() - cached.ts < SERVER_CACHE_TTL) {
    return NextResponse.json(cached.data)
  }

  try {
    // Получаем данные из Jikan API
    const jikanResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`)
    const jikanData = await jikanResponse.json()

    if (!jikanData.data) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 })
    }

  const anime = jikanData.data

    // Пока используем моковые данные о доступных озвучках
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

    // Получаем похожие аниме
    const recommendationsResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`)
    const recommendationsData = await recommendationsResponse.json()

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
      recommendations:
        recommendationsData.data?.slice(0, 6).map((rec: any) => ({
          id: rec.entry.mal_id,
          title: rec.entry.title,
          image: rec.entry.images?.jpg?.image_url,
          votes: rec.votes,
        })) || [],
    }

  // Сохраняем в серверный кэш
  detailsCache.set(id, { ts: Date.now(), data: detailedAnime })
  return NextResponse.json(detailedAnime)
  } catch (error) {
    console.error("Error fetching anime details:", error)
    return NextResponse.json({ error: "Failed to fetch anime details" }, { status: 500 })
  }
}

async function getDetailedDubInfo(malId: number) {
  const dubs = []

  // Anilibria integration
  try {
    const anilibriaResponse = await fetch(`https://api.anilibria.tv/v3/title/search?search=${malId}`)
    if (anilibriaResponse.ok) {
      const anilibriaData = await anilibriaResponse.json()
      if (anilibriaData.list && anilibriaData.list.length > 0) {
        const title = anilibriaData.list[0]
        dubs.push({
          provider: "Anilibria",
          quality: ["720p", "1080p"],
          episodes: title.player?.list || {},
          description: "Профессиональная озвучка от команды AniLibria",
          logo: "/anilibria-logo.png",
        })
      }
    }
  } catch (error) {
    console.log("Anilibria API unavailable")
  }

  // Mock данные для других провайдеров
  dubs.push(
    {
      provider: "AnimeVost",
      quality: ["480p", "720p", "1080p"],
      episodes: generateDetailedMockEpisodes(24),
      description: "Качественная озвучка от AnimeVost",
      logo: "/animevost-logo.png",
    },
    {
      provider: "AniDub",
      quality: ["720p", "1080p"],
      episodes: generateDetailedMockEpisodes(24),
      description: "Профессиональный дубляж на русском языке",
      logo: "/anidub-logo.png",
    },
  )

  return dubs
}

function generateDetailedMockEpisodes(count: number) {
  const episodes: { [key: string]: any } = {}
  for (let i = 1; i <= count; i++) {
    episodes[i] = {
      name: `Серия ${i}`,
      uuid: `episode-${i}`,
      preview: `/placeholder.svg?height=200&width=350&query=anime episode ${i}`,
      skips: {
        opening: [90, 180],
        ending: [1320, 1410],
      },
      hls: {
        fhd: `https://cache.libria.fun/videos/media/ts/1234/fhd/episode-${i}.m3u8`,
        hd: `https://cache.libria.fun/videos/media/ts/1234/hd/episode-${i}.m3u8`,
        sd: `https://cache.libria.fun/videos/media/ts/1234/sd/episode-${i}.m3u8`,
      },
    }
  }
  return episodes
}
