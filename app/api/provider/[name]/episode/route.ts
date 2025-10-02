import { NextResponse } from "next/server"
import { getDubProvider } from "@/lib/providers/index"

const PROVIDER_EPISODE_CACHE_TTL = 1000 * 60 * 5 // 5 минут
const providerEpisodeCache = new Map<string, { ts: number; url: string }>()

function withTimeout<T>(p: Promise<T>, ms = 3000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms)
    p.then((v) => {
      clearTimeout(t)
      resolve(v)
    }).catch((e) => {
      clearTimeout(t)
      reject(e)
    })
  })
}

export async function GET(request: Request, { params }: { params: { name: string } }) {
  const { searchParams } = new URL(request.url)
  const animeId = Number(searchParams.get('animeId'))
  const episode = Number(searchParams.get('episode'))
  const quality = searchParams.get('quality') || '1080p'
  const pageUrl = searchParams.get('pageUrl') || undefined
  const name = params.name

  const cacheKey = `${name}::${animeId}::${episode}::${quality}::${pageUrl || ''}`
  const cached = providerEpisodeCache.get(cacheKey)
  if (cached && Date.now() - cached.ts < PROVIDER_EPISODE_CACHE_TTL) {
    return NextResponse.json({ url: cached.url })
  }

  const provider = getDubProvider(name)
  if (!provider) return NextResponse.json({ error: 'Provider not found' }, { status: 404 })

  try {
    const url = await withTimeout(provider.getEpisodeUrl(animeId, episode, quality), 3000)
    providerEpisodeCache.set(cacheKey, { ts: Date.now(), url })
    return NextResponse.json({ url })
  } catch (e) {
    console.error('Provider episode error', e)
    const fallback = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    providerEpisodeCache.set(cacheKey, { ts: Date.now(), url: fallback })
    return NextResponse.json({ url: fallback })
  }
}
