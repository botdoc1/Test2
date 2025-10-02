import { type NextRequest, NextResponse } from "next/server"
import { getDubProvider } from "@/lib/providers/index"

const EPISODES_CACHE_TTL = 1000 * 60 * 5 // 5 минут
const episodesCache = new Map<string, { ts: number; data: any }>()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const providerName = (searchParams.get("provider") || "anidub").toLowerCase()

  const cacheKey = `${id}::${providerName}`
  const cached = episodesCache.get(cacheKey)
  if (cached && Date.now() - cached.ts < EPISODES_CACHE_TTL) {
    return NextResponse.json(cached.data)
  }

  try {
    const provider = getDubProvider(providerName)
    const episodes = await generateEpisodesForProvider(Number.parseInt(id), providerName, provider)

    const payload = {
      animeId: id,
      provider: providerName,
      episodes,
    }

    episodesCache.set(cacheKey, { ts: Date.now(), data: payload })
    return NextResponse.json(payload)
  } catch (error) {
    console.error("Error fetching episodes:", error)
    return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 })
  }
}

async function generateEpisodesForProvider(animeId: number, providerName: string, provider: any) {
  const episodeCount = 24 // В реальности получали бы из API
  const episodes = []

  for (let i = 1; i <= episodeCount; i++) {
    let qualities: string[] = ["1080p", "720p", "480p"]

    if (provider) {
      try {
        qualities = await provider.getAvailableQualities(animeId, i)
      } catch (e) {
        console.error(`Failed to get qualities for episode ${i}:`, e)
      }
    }

    const sources: Record<string, string> = {}
    for (const quality of qualities) {
      sources[quality] = `/api/provider/${providerName}/episode?animeId=${animeId}&episode=${i}&quality=${quality}`
    }

    episodes.push({
      number: i,
      title: `Серия ${i}`,
      description: `Описание серии ${i}`,
      thumbnail: `/placeholder.svg?height=200&width=350&query=anime episode ${i}`,
      duration: "24:00",
      airDate: new Date(2024, 0, i).toISOString(),
      sources,
      subtitles: [
        {
          language: "ru",
          url: `https://example.com/${providerName}/anime-${animeId}/episode-${i}/ru.vtt`,
        },
      ],
    })
  }

  return episodes
}
