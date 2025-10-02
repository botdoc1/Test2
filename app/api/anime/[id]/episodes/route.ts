import { type NextRequest, NextResponse } from "next/server"

const EPISODES_CACHE_TTL = 1000 * 60 * 5 // 5 минут
const episodesCache = new Map<string, { ts: number; data: any }>()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const { searchParams } = new URL(request.url)
  const provider = (searchParams.get("provider") || "Anilibria").toString()

  const cacheKey = `${id}::${provider}`
  const cached = episodesCache.get(cacheKey)
  if (cached && Date.now() - cached.ts < EPISODES_CACHE_TTL) {
    return NextResponse.json(cached.data)
  }

  try {
    // В реальном приложении здесь был бы запрос к соответствующему API
    const episodes = generateEpisodesForProvider(Number.parseInt(id), provider)

    const payload = {
      animeId: id,
      provider,
      episodes,
    }

    // Сохраняем результат в простом серверном кэше (in-memory)
    episodesCache.set(cacheKey, { ts: Date.now(), data: payload })

    return NextResponse.json(payload)
  } catch (error) {
    console.error("Error fetching episodes:", error)
    return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 })
  }
}

function generateEpisodesForProvider(animeId: number, provider: string) {
  const episodeCount = 24 // В реальности получали бы из API
  const episodes = []

  for (let i = 1; i <= episodeCount; i++) {
    episodes.push({
      number: i,
      title: `Серия ${i}`,
      description: `Описание серии ${i}`,
      thumbnail: `/placeholder.svg?height=200&width=350&query=anime episode ${i}`,
      duration: "24:00",
      airDate: new Date(2024, 0, i).toISOString(),
      // Для разработки возвращаем публичный MP4 для всех качеств
      sources: {
        "1080p": `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
        "720p": `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
        "480p": `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
      },
      subtitles: [
        {
          language: "ru",
          url: `https://example.com/${provider.toLowerCase()}/anime-${animeId}/episode-${i}/ru.vtt`,
        },
      ],
    })
  }

  return episodes
}
